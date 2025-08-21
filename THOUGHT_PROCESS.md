# Sleep Questionnaire App - Thought Process Documentation

## Overview
This document outlines the design decisions, assumptions, and implementation choices made while building the comprehensive sleep questionnaire app based on the scaffold-2025.07 foundation.

## Design Decisions

### 1. Database Choice
- **Decision**: Switched from PostgreSQL to SQLite for local development
- **Reasoning**: Simplified setup and testing without requiring external database server
- **Implementation**: Updated Prisma schema and .env configuration

### 2. Multi-Step Form Architecture
- **Decision**: Used React Hook Form with Zod validation for each questionnaire section
- **Reasoning**: Follows scaffold patterns and provides robust form validation
- **Components Created**:
  - `QuestionnaireForm.tsx` - Main container managing state and navigation
  - `QuestionnaireStep.tsx` - Individual section renderer with dynamic validation
  - `QuestionnaireNavigation.tsx` - Progress indicator and section navigation

### 3. Question Type Support
- **Decision**: Implemented multiple question types (radio, checkbox, number, text, time, scale)
- **Reasoning**: Supports the diverse question formats in the sleep questionnaire document
- **Implementation**: Dynamic schema generation based on question configuration

### 4. Scoring Algorithm Implementation
- **Decision**: Created modular scoring functions for each sleep disorder
- **Reasoning**: Allows for easy testing and modification of individual scoring criteria
- **Disorders Covered**:
  - Excessive Daytime Sleepiness (EDS)
  - Insomnia (sleep onset, maintenance, early morning awakening)
  - Sleep Apnea probability
  - Restless Legs Syndrome
  - Narcolepsy detection
  - Circadian Rhythm Disorders
  - COMISA (combined insomnia and sleep apnea)

### 5. Report Generation Strategy
- **Decision**: Template-based narrative report generation with conditional content
- **Reasoning**: Provides personalized, actionable recommendations based on scoring results
- **Content Areas**:
  - Sleep disorder identification and recommendations
  - Health optimization areas with specific tips
  - External resource links (placeholder URLs for now)

## Assumptions Made

### 1. External Link Destinations
- **Assumption**: Used placeholder URLs for external links to Somna Health website and clinician directories
- **Reasoning**: Actual URLs not provided in requirements
- **Placeholder Format**: `https://somnahealth.com/[resource-type]`
- **Note**: These will need to be updated with real URLs before production

### 2. Questionnaire Flow
- **Assumption**: Linear progression through all 8 sections plus demographics
- **Reasoning**: Simplifies user experience and ensures complete data collection
- **Implementation**: 9 total steps with progress indication

### 3. Validation Requirements
- **Assumption**: Most questions are required unless explicitly marked optional
- **Reasoning**: Ensures comprehensive data for accurate scoring
- **Exception**: Sub-questions and conditional questions are typically optional

### 4. Data Storage
- **Assumption**: Store complete responses as JSON for flexibility
- **Reasoning**: Allows for easy analysis and report regeneration
- **Schema**: Separate fields for demographics, responses, scores, and generated report

## Technical Implementation Choices

### 1. Form State Management
- **Choice**: React Hook Form with controlled components
- **Challenge**: Encountered controlled/uncontrolled input warnings
- **Solution Attempted**: Added default values and proper initialization
- **Status**: Still experiencing form navigation issues

### 2. Styling Approach
- **Choice**: Tailwind CSS with shadcn/ui components
- **Reasoning**: Follows scaffold patterns and provides consistent design
- **Components Used**: Card, Button, Form, Input, RadioGroup, Checkbox, Progress

### 3. API Route Structure
- **Choice**: Next.js 15 App Router API routes
- **Endpoints**:
  - `POST /api/questionnaire` - Save questionnaire response
  - `GET /api/results/[id]` - Retrieve saved results
- **Error Handling**: Comprehensive try-catch blocks with proper HTTP status codes

### 4. Type Safety
- **Choice**: Strict TypeScript with Zod validation schemas
- **Implementation**: Separate validation schemas for each questionnaire section
- **Challenge**: Some `any` types used for form compatibility (to be refined)

## Areas Requiring User Input

### 1. External URLs
- Somna Health website links
- Clinician directory URLs
- Educational resource links
- Research paper references

### 2. Scoring Algorithm Refinement
- Threshold values for disorder detection
- Weighting factors for different symptoms
- Validation against clinical standards

### 3. Report Content
- Specific recommendation text
- Resource descriptions
- Call-to-action messaging

### 4. Form Control Issues
- Resolving controlled/uncontrolled input warnings
- Ensuring smooth navigation between sections
- Form validation edge cases

## Current Status

### Completed
✅ Scaffold foundation copied and adapted
✅ Database schema designed and implemented
✅ All 8 questionnaire sections defined with proper questions
✅ Scoring algorithms implemented for all sleep disorders
✅ Narrative report generation system created
✅ API routes for data persistence
✅ Responsive UI with progress indication
✅ TypeScript compilation passing
✅ Development server running successfully

### In Progress
🔄 Form navigation between sections (React state management issue)
🔄 Complete end-to-end testing of questionnaire flow

### Pending
⏳ Final testing and validation
⏳ Production build verification
⏳ Git commit and PR creation

## Next Steps
1. Resolve form control state management issues
2. Complete end-to-end testing of all questionnaire sections
3. Verify report generation with various response patterns
4. Run final linting and type checking
5. Create pull request with comprehensive description

## Notes for Future Development
- Consider adding form progress persistence (localStorage)
- Implement question skip logic for better user experience
- Add accessibility improvements (ARIA labels, keyboard navigation)
- Consider internationalization support
- Add analytics tracking for questionnaire completion rates
