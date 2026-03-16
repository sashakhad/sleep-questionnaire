'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { QuestionnaireForm, sections, sectionTitles } from '@/components/questionnaire/QuestionnaireForm';
import { type QuestionnaireSection } from '@/types/questionnaire';

function DevPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sectionParam = searchParams.get('section') as QuestionnaireSection | null;
  const initialSection = sectionParam && sections.includes(sectionParam) ? sectionParam : undefined;
  const navParam = searchParams.get('nav');
  const [sidebarOpen, setSidebarOpen] = useState(navParam !== '0');

  function buildUrl(section: string, nav?: boolean) {
    const params = new URLSearchParams();
    params.set('section', section);
    const showNav = nav ?? sidebarOpen;
    if (!showNav) {
      params.set('nav', '0');
    }
    return `/dev?${params.toString()}`;
  }

  function handleSectionChange(section: QuestionnaireSection) {
    router.replace(buildUrl(section), { scroll: false });
  }

  function handleToggleNav() {
    const next = !sidebarOpen;
    setSidebarOpen(next);
    const section = sectionParam ?? sections[0]!;
    router.replace(buildUrl(section, next), { scroll: false });
  }

  return (
    <div className='flex min-h-screen'>
      <button
        onClick={handleToggleNav}
        className='fixed top-2 left-2 z-[60] rounded bg-amber-600 px-2 py-1 text-xs font-medium text-white shadow-md hover:bg-amber-700 transition-colors'
      >
        {sidebarOpen ? 'Hide Nav' : 'Show Nav'}
      </button>

      {sidebarOpen && (
        <nav className='bg-card fixed top-0 left-0 z-50 h-full w-56 overflow-y-auto border-r p-3 pt-10'>
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
                      const url = buildUrl(section);
                      router.replace(url, { scroll: false });
                      window.location.href = url;
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
      )}

      <main className={`flex-1 transition-[margin] ${sidebarOpen ? 'ml-56' : 'ml-0'}`}>
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
