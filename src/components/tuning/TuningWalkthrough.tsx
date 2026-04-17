'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const DISMISS_STORAGE_KEY = 'tuning-walkthrough-dismissed-v1';

interface TuningWalkthroughProps {
  onDismiss?: () => void;
}

export function TuningWalkthrough({ onDismiss }: TuningWalkthroughProps) {
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(DISMISS_STORAGE_KEY);
    setDismissed(storedValue === 'true');
  }, []);

  function handleDismiss() {
    window.localStorage.setItem(DISMISS_STORAGE_KEY, 'true');
    setDismissed(true);
    onDismiss?.();
  }

  if (dismissed === null || dismissed === true) {
    return null;
  }

  return (
    <div className='border-primary/20 bg-primary/5 relative rounded-2xl border p-5 sm:p-6'>
      <Button
        variant='ghost'
        size='icon'
        className='absolute top-3 right-3 h-8 w-8'
        onClick={handleDismiss}
        aria-label='Dismiss walkthrough'
      >
        <X className='h-4 w-4' />
      </Button>

      <p className='text-primary text-xs font-semibold tracking-wide uppercase'>
        How this page works
      </p>
      <h2 className='mt-1 text-xl font-semibold tracking-tight'>
        Review and adjust the diagnostic algorithm without editing code
      </h2>
      <p className='text-muted-foreground mt-2 max-w-3xl text-sm leading-relaxed'>
        Each card below shows one disorder the algorithm screens for. The
        checklist inside is the exact decision trail used on this patient —
        which criteria were met, which were not, and which thresholds fired.
      </p>

      <ol className='mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <li className='space-y-1'>
          <p className='text-primary text-sm font-semibold'>1. Pick a patient</p>
          <p className='text-muted-foreground text-sm leading-relaxed'>
            Choose a named scenario at the top of the page, or switch to a
            custom profile and enter your own values.
          </p>
        </li>
        <li className='space-y-1'>
          <p className='text-primary text-sm font-semibold'>2. Read the trail</p>
          <p className='text-muted-foreground text-sm leading-relaxed'>
            Each disorder card shows the criteria the algorithm checked, the
            patient&apos;s value, and whether the criterion was met.
          </p>
        </li>
        <li className='space-y-1'>
          <p className='text-primary text-sm font-semibold'>3. Adjust thresholds</p>
          <p className='text-muted-foreground text-sm leading-relaxed'>
            If you disagree with a cutoff, open the &quot;Thresholds for this
            screen&quot; section on any card and change the value. The card
            updates immediately.
          </p>
        </li>
        <li className='space-y-1'>
          <p className='text-primary text-sm font-semibold'>4. Validate</p>
          <p className='text-muted-foreground text-sm leading-relaxed'>
            Scroll to the bottom and run all scenarios to see how your changes
            affect every test case.
          </p>
        </li>
      </ol>
    </div>
  );
}
