export type ReviewDocumentSlug = 'algorithm-reference' | 'client-review-guide';

export interface ReviewDocumentDefinition {
  slug: ReviewDocumentSlug;
  title: string;
  shortLabel: string;
  description: string;
  repoPath: string;
}

export const reviewDocumentDefinitions: ReviewDocumentDefinition[] = [
  {
    slug: 'algorithm-reference',
    title: 'Sleep Algorithm Reference',
    shortLabel: 'Algorithm reference',
    description:
      'The detailed written source of truth for the algorithm, including rules, thresholds, and clarifications that still need sign-off.',
    repoPath: 'docs/ALGORITHM_REFERENCE.md',
  },
  {
    slug: 'client-review-guide',
    title: 'Client Algorithm Review Guide',
    shortLabel: 'Review guide',
    description:
      'A shorter explanation of how to use the review flow, what the algorithm viewer shows, and how to interpret the patient-facing report preview.',
    repoPath: 'docs/CLIENT_ALGORITHM_REVIEW_MODE.md',
  },
];

export function getReviewDocumentDefinition(
  slug: string
): ReviewDocumentDefinition | undefined {
  return reviewDocumentDefinitions.find(document => document.slug === slug);
}

export function getReviewDocumentUrl(slug: ReviewDocumentSlug): string {
  return `/review/reference/${slug}`;
}
