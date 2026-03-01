'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { QuestionnaireForm, sections, sectionTitles } from '@/components/questionnaire/QuestionnaireForm';
import { type QuestionnaireSection } from '@/types/questionnaire';

function DevPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sectionParam = searchParams.get('section') as QuestionnaireSection | null;
  const initialSection = sectionParam && sections.includes(sectionParam) ? sectionParam : undefined;

  function handleSectionChange(section: QuestionnaireSection) {
    router.replace(`/dev?section=${section}`, { scroll: false });
  }

  return (
    <div className='flex min-h-screen'>
      <nav className='bg-card fixed top-0 left-0 z-50 h-full w-56 overflow-y-auto border-r p-3'>
        <h2 className='mb-3 text-xs font-bold tracking-wider text-amber-600 uppercase'>
          Dev Navigation
        </h2>
        <ul className='space-y-0.5'>
          {sections.map((section, index) => {
            const isActive = sectionParam === section || (!sectionParam && index === 0);
            return (
              <li key={section}>
                <button
                  onClick={() => {
                    router.replace(`/dev?section=${section}`, { scroll: false });
                    window.location.href = `/dev?section=${section}`;
                  }}
                  className={`w-full rounded px-2 py-1.5 text-left text-xs transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <span className='text-muted-foreground mr-1.5 font-mono'>{index}.</span>
                  {sectionTitles[section]}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <main className='ml-56 flex-1'>
        <QuestionnaireForm
          initialSection={initialSection}
          prefill={true}
          onSectionChange={handleSectionChange}
        />
      </main>
    </div>
  );
}

export default function DevPage() {
  return (
    <Suspense fallback={<div className='flex min-h-screen items-center justify-center'>Loading...</div>}>
      <DevPageContent />
    </Suspense>
  );
}
