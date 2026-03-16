import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ReviewPageClient } from './ReviewPageClient';

export const metadata: Metadata = {
  title: 'Algorithm Review | SomnaHealth',
  description:
    'Review named questionnaire scenarios, inspect algorithm paths, and compare expected versus actual outcomes.',
};

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className='flex min-h-screen items-center justify-center'>Loading...</div>}>
      <ReviewPageClient />
    </Suspense>
  );
}
