import path from 'node:path';
import { readFile } from 'node:fs/promises';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, FileText } from 'lucide-react';
import { marked } from 'marked';
import { Button } from '@/components/ui/button';
import {
  getReviewDocumentDefinition,
  getReviewDocumentUrl,
  reviewDocumentDefinitions,
} from '@/lib/review-documents';
import { ReferenceDocumentPrintButton } from '../ReferenceDocumentPrintButton';

interface ReviewReferencePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return reviewDocumentDefinitions.map(document => ({
    slug: document.slug,
  }));
}

export async function generateMetadata({
  params,
}: ReviewReferencePageProps): Promise<Metadata> {
  const { slug } = await params;
  const document = getReviewDocumentDefinition(slug);

  if (!document) {
    return {
      title: 'Reference Not Found | SomnaHealth',
    };
  }

  return {
    title: `${document.title} | SomnaHealth`,
    description: document.description,
  };
}

export default async function ReviewReferencePage({
  params,
}: ReviewReferencePageProps) {
  const { slug } = await params;
  const document = getReviewDocumentDefinition(slug);

  if (!document) {
    notFound();
  }

  const absolutePath = path.join(process.cwd(), document.repoPath);
  const markdown = await readFile(absolutePath, 'utf8');
  const html = await marked.parse(markdown);

  return (
    <div className='bg-gradient-sleep min-h-screen py-8 md:py-12 print:bg-background print:py-0'>
      <div className='container mx-auto max-w-5xl px-4'>
        <div className='mb-6 flex flex-col gap-4 print:hidden md:flex-row md:items-center md:justify-between'>
          <Button asChild variant='ghost' className='w-fit'>
            <Link href='/review'>
              <ArrowLeft className='h-4 w-4' />
              Back to review
            </Link>
          </Button>

          <div className='flex flex-wrap gap-2'>
            {reviewDocumentDefinitions.map(reviewDocument => (
              <Button
                key={reviewDocument.slug}
                asChild
                variant={reviewDocument.slug === document.slug ? 'default' : 'outline'}
              >
                <Link href={getReviewDocumentUrl(reviewDocument.slug)}>
                  <FileText className='h-4 w-4' />
                  {reviewDocument.shortLabel}
                </Link>
              </Button>
            ))}
            <ReferenceDocumentPrintButton />
          </div>
        </div>

        <div className='shadow-sleep-lg overflow-hidden rounded-3xl border bg-card/90 print:border-0 print:shadow-none'>
          <div className='bg-gradient-sleep-header px-6 py-8 text-white print:bg-none print:px-0 print:pb-6 print:text-foreground'>
            <div className='max-w-3xl space-y-3'>
              <p className='text-sm font-medium text-white/80 print:text-muted-foreground'>
                Reference document
              </p>
              <h1 className='text-3xl font-semibold tracking-tight md:text-4xl'>
                {document.title}
              </h1>
              <p className='max-w-3xl text-sm leading-relaxed text-white/85 md:text-base print:text-muted-foreground'>
                {document.description}
              </p>
              <p className='text-xs text-white/75 print:hidden'>
                Use your browser&apos;s print dialog to save this page as a PDF if you want to share
                or archive it.
              </p>
            </div>
          </div>

          <div className='border-border/70 bg-background/90 border-t px-6 py-8 md:px-8 print:border-0 print:bg-transparent print:px-0 print:py-0'>
            <article
              className='review-markdown'
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
