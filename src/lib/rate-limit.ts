import 'server-only';

import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Caveats:
 * - On serverless (Vercel), each function instance has its own memory, so the
 *   effective limit per IP can be N×instances. This is still a meaningful
 *   abuse-mitigation layer for a small public surface.
 * - If we ever need strong guarantees, swap this for Upstash / Vercel KV.
 */

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  diagnose: { windowMs: 60_000, maxRequests: 10 },
  'generate-pdf': { windowMs: 60_000, maxRequests: 5 },
  'submit-response': { windowMs: 60_000, maxRequests: 5 },
};

interface BucketState {
  timestamps: number[];
}

const buckets = new Map<string, BucketState>();

function getClientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  const userAgent = request.headers.get('user-agent') || '';
  const accept = request.headers.get('accept') || '';
  const acceptLang = request.headers.get('accept-language') || '';

  return `fingerprint:${userAgent}:${accept}:${acceptLang}`;
}

function pruneStaleBuckets(now: number): void {
  // Keep the map from growing unbounded: drop buckets with no recent activity.
  const maxIdleMs = 5 * 60_000;
  for (const [key, bucket] of buckets) {
    const latest = bucket.timestamps[bucket.timestamps.length - 1];
    if (latest === undefined || now - latest > maxIdleMs) {
      buckets.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function recordRateLimitHit(
  request: NextRequest,
  limitName: keyof typeof RATE_LIMIT_CONFIGS | string
): RateLimitResult {
  const config = RATE_LIMIT_CONFIGS[limitName];
  if (!config) {
    return { allowed: true, remaining: Number.POSITIVE_INFINITY, retryAfterSeconds: 0 };
  }

  const now = Date.now();
  const clientId = getClientIdentifier(request);
  const bucketKey = `${limitName}:${clientId}`;

  if (Math.random() < 0.01) {
    pruneStaleBuckets(now);
  }

  const bucket = buckets.get(bucketKey) ?? { timestamps: [] };
  const windowStart = now - config.windowMs;
  const recent = bucket.timestamps.filter(ts => ts > windowStart);

  if (recent.length >= config.maxRequests) {
    const oldest = recent[0] ?? now;
    const retryAfterMs = Math.max(0, oldest + config.windowMs - now);
    buckets.set(bucketKey, { timestamps: recent });
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  recent.push(now);
  buckets.set(bucketKey, { timestamps: recent });

  return {
    allowed: true,
    remaining: config.maxRequests - recent.length,
    retryAfterSeconds: 0,
  };
}

/**
 * Convenience wrapper: returns a 429 response if the request should be
 * rejected, or null if the request should proceed.
 */
export function checkRateLimit(
  request: NextRequest,
  limitName: keyof typeof RATE_LIMIT_CONFIGS | string
): NextResponse | null {
  const result = recordRateLimitHit(request, limitName);
  if (result.allowed) {
    return null;
  }

  return NextResponse.json(
    {
      error: 'Too many requests. Please try again shortly.',
      retryAfterSeconds: result.retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(result.retryAfterSeconds),
      },
    }
  );
}
