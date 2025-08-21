# Sleep Questionnaire App

A comprehensive sleep health assessment questionnaire built with Next.js 15, React 19, TypeScript, and shadcn/ui.

## Features

- Multi-step questionnaire with 8 sections covering sleep health
- Psychometrically validated questions for accurate assessment
- Scoring algorithms for sleep disorders vs health optimization
- Personalized narrative reports with external resource links
- Freemium model collecting minimal personal data (birth year, zipcode, sex)

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
# Add your DATABASE_URL
```

3. Set up the database:
```bash
pnpm run db:generate
pnpm run db:push
```

4. Start the development server:
```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the questionnaire.

## Sleep Assessment Areas

### Sleep Disorders Assessed:
- Insomnia (sleep onset, maintenance, early morning awakening)
- Circadian rhythm disorders
- Insufficient sleep syndrome
- Obstructive sleep apnea
- COMISA (Comorbid insomnia and sleep apnea)
- Restless legs syndrome
- Idiopathic hypersomnia and narcolepsy

### Health Optimization Areas:
- Irregular sleep-wake schedule
- Bedroom sleep hygiene
- Caffeine optimization
- Food and alcohol guidance
- Sleep ritual development

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Forms**: React Hook Form with Zod validation
- **Database**: Prisma with PostgreSQL
- **Testing**: Jest, React Testing Library

