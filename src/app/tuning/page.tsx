import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TuningDashboard } from '@/components/tuning/TuningDashboard';

export const metadata: Metadata = {
  title: 'Algorithm Tuning | SomnaHealth',
  description:
    'Adjust diagnostic thresholds, test named scenarios, and inspect the live clinical decision path.',
};

export default function TuningPage() {
  return (
    <Suspense fallback={<div className='flex min-h-screen items-center justify-center'>Loading...</div>}>
      <TuningDashboard />
    </Suspense>
  );
}
