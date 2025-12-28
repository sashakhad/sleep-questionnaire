# Sleep Questionnaire - Requirements Document

This document consolidates all requirements from original communications and specifications for the SomnaHealth Sleep Questionnaire application.

## Source Documents

Original correspondence and specifications are archived in `docs/correspondence/`:

- `emailInstructions.md` - Initial email with high-level requirements
- `OUTLINE.md` - Detailed questionnaire structure and scoring logic
- `questionnaire-comments.txt` - Converted from Word doc with detailed scoring and messages
- `SOW.txt` - Statement of Work (converted from PDF)

---

## 1. Project Overview

### 1.1 Purpose

A web-based interactive questionnaire focused on sleep health and sleep disorders that:

- Provides patients with a guided, validated questionnaire
- Generates a narrative report with tailored guidance, educational links, and references to clinicians
- Offers a freemium experience that only collects de-identified demographic data
- Outputs recommendations for either sleep health optimization or probable diagnoses (non-treatment)

### 1.2 Key Characteristics

- **Completion time**: ~15 minutes
- **Model**: Freemium (free to use)
- **Data collection**: De-identified only (year of birth, county/zipcode, sex)
- **Output**: Personalized narrative report with PDF download
- **Deployment**: Standalone application on Vercel

### 1.3 Project Scope (from SOW)

**Included Features:**

- [x] Interactive questionnaire with branching logic (psychometrically validated)
- [x] Report generation with narrative summary
- [x] PDF download option
- [x] Database setup for response storage
- [x] Basic data retrieval (CSV download)
- [x] Deployment to Vercel

**Not Included (may be scoped separately):**

- [ ] UI/UX design polish beyond current state
- [ ] Custom domain purchase, DNS setup, or hosting outside Vercel
- [ ] Ongoing hosting/database costs beyond initial deployment
- [ ] Integration into existing website
- [ ] Extensive project management

---

## 2. Functional Requirements

### 2.1 User Flow

- [ ] User completes questionnaire (no account required)
- [ ] System generates personalized narrative report
- [ ] Report includes links to educational content and clinician resources
- [ ] User can download PDF report
- [ ] User can print report
- [ ] User is responsible for report security after generation

### 2.2 Data Collection (Demographics)

Only collect de-identified information:

- [ ] Year of birth
- [ ] Zipcode OR county
- [ ] Sex
- [ ] Weight (for BMI calculation)
- [ ] Height (for BMI calculation)

### 2.3 Admin Features

- [ ] Access to raw, de-identified response data
- [ ] CSV export/download capability
- [ ] Response viewing dashboard

---

## 3. Questionnaire Sections

### 3.1 Section Overview

| Section            | Description                          | Status |
| ------------------ | ------------------------------------ | ------ |
| Introduction       | Privacy notice, instructions         | [ ]    |
| Demographics       | Age, location, sex, BMI              | [ ]    |
| Daytime Sleepiness | Naps, dozing, EDS assessment         | [ ]    |
| Night-Time Sleep   | Bedtime, wake patterns, SOL, WASO    | [ ]    |
| Breathing Issues   | Snoring, apnea, treatment            | [ ]    |
| Restless Legs      | RLS symptoms and treatment           | [ ]    |
| Parasomnias        | Sleep walking, talking, behaviors    | [ ]    |
| Nightmares         | Frequency, trauma association        | [ ]    |
| Chronotype         | Sleep preference, shift work         | [ ]    |
| Sleep Aids         | Medications, supplements             | [ ]    |
| Lifestyle          | Bedroom, caffeine, alcohol, exercise | [ ]    |
| Mental Health      | Anxiety, worry, rumination           | [ ]    |

### 3.2 Conditional Logic

Questions should appear conditionally based on previous answers:

- [ ] Nap duration only if naps ≥ 1 day/week
- [ ] Tiredness severity only if tiredness interferes with daily activities
- [ ] Wake-up causes only if wake-ups > 2/night
- [ ] Treatment details only if disorder is diagnosed
- [ ] Nightmare trauma questions only if nightmares present

---

## 4. Sleep Disorder Detection

### 4.1 Disorders to Screen For

| Disorder                           | Key Indicators                                          | Status |
| ---------------------------------- | ------------------------------------------------------- | ------ |
| Excessive Daytime Sleepiness (EDS) | Naps ≥3 days/week AND ≥30 mins; dozing score ≥7         | [ ]    |
| Insomnia - Sleep Onset             | SOL > 30min AND ≥3 nights/week                          | [ ]    |
| Insomnia - Sleep Maintenance       | WASO > 40min AND ≥3 nights/week                         | [ ]    |
| Insomnia - Early Morning           | Wake >20 min early AND >2 days/week                     | [ ]    |
| Circadian Rhythm - DSPD            | Mid-sleep > 4am (or 6am), evening preference, SOL > 30  | [ ]    |
| Circadian Rhythm - ASPD            | Mid-sleep < 1am (or 12am), morning preference           | [ ]    |
| Circadian Rhythm - Non-24          | Bedtime varies > 1.5 hours on weeknights                | [ ]    |
| Insufficient Sleep Syndrome        | TST < 6 hours with EDS/tiredness                        | [ ]    |
| Obstructive Sleep Apnea            | Snoring, gasping, stopped breathing reports             | [ ]    |
| COMISA                             | Combined insomnia + sleep apnea symptoms                | [ ]    |
| Restless Legs Syndrome             | Leg discomfort, urge to move, relief with movement      | [ ]    |
| Narcolepsy                         | Cataplexy, sleep paralysis, dreams during naps, EDS > 7 | [ ]    |
| Idiopathic Hypersomnia             | EDS > 7 without narcolepsy signs, TST > 7.5 hours       | [ ]    |
| Chronic Fatigue                    | EDS < 7, tiredness, non-restorative sleep               | [ ]    |
| Fibromyalgia indicators            | Tiredness + non-restorative sleep + muscle/joint pain   | [ ]    |
| Parasomnias                        | Sleepwalking, talking, terrors, REM behavioral disorder | [ ]    |
| Nightmare Disorder                 | ≥3 nightmares/week or linked to trauma                  | [ ]    |

### 4.2 Calculated Metrics

| Metric                        | Calculation                                  | Thresholds                              |
| ----------------------------- | -------------------------------------------- | --------------------------------------- |
| Total Sleep Time (TST)        | (Lights out - Wake time) - SOL - WASO        | <6h insufficient, 6-7h short, >9h long  |
| Time in Bed (TIB)             | Bedtime - Out of bed time                    | N/A                                     |
| Sleep Efficiency              | TST / TIB × 100                              | <85% = Insomnia                         |
| Sleep Onset Latency (SOL)     | Time to fall asleep                          | >30 min = Insomnia                      |
| Wake After Sleep Onset (WASO) | Total time awake during night                | >40 min = Insomnia                      |
| Mid-sleep Time                | (TST / 2) + Lights out                       | >4-6am = DSPD, <1am = ASPD              |
| Social Jetlag                 | Weekend mid-sleep - Weekday mid-sleep        | >1.5-2 hours = Issue                    |
| Dozing Score                  | Sum of situation weights (see questionnaire) | 3-4 mild, 5-6 moderate, 7+ probable EDS |

### 4.3 Sleep Duration Classification

| Weekly Average TST | Classification     |
| ------------------ | ------------------ |
| < 6 hours          | Insufficient sleep |
| 6-7 hours (no EDS) | Short sleeper      |
| 7-9 hours          | Normal             |
| > 9 hours          | Long sleeper       |

---

## 5. Report Generation

### 5.1 Report Structure

- [ ] Personalized greeting
- [ ] Sleep duration summary (weekday vs weekend, total weekly average)
- [ ] Sleep onset time assessment (prolonged/short/normal)
- [ ] Wake frequency and duration assessment
- [ ] Sleep efficiency calculation and interpretation
- [ ] Chronotype determination (evening/morning/flexible)
- [ ] Daytime sleepiness assessment (none/mild/moderate/severe)
- [ ] Daytime tiredness assessment
- [ ] Sleep hygiene assessment
- [ ] Disorder-specific findings with tailored messages
- [ ] External resource links

### 5.2 Report Messages

The report should include condition-specific messages. Key message categories:

**Excessive Daytime Sleepiness (EDS):**

> "Excessive Daytime Sleepiness (EDS) means you feel overly sleepy during the day, even if you think you sleep enough. This is different from daytime tiredness because you do not just feel the need for sleep, but you can actually fall asleep. It can impact focus, mood and quality of life..."

**Poor Sleep Hygiene:**

> "Daytime naps might decrease your nighttime sleep drive and cause symptoms of insomnia. You can visit our website for more information on napping and other optimal sleep hygiene habits..."

**Narcolepsy/Cataplexy:**

> "Sudden weakness triggered by emotion (cataplexy) is a classic narcolepsy symptom... We strongly recommend that you make an appointment with a sleep specialist or neurologist as soon as possible..."

**Chronic Fatigue:**

> "You have some symptoms of chronic fatigue syndrome. Improving your sleep quality which includes treating your insomnia symptoms can improve symptoms..."

**Safety Warning (EDS severity > 8):**

> "You should seek immediate help from a health care professional and until you have done so, you should consider avoiding potentially dangerous activities such as driving, biking or have a job involving high risk activities..."

### 5.3 Sleep Health Optimization Areas

When no disorder is detected, provide guidance on:

- [ ] Irregular sleep-wake schedule
- [ ] Bedroom sleep hygiene tips
- [ ] Caffeine timing tips
- [ ] Food and alcohol tips
- [ ] Building a sleep ritual
- [ ] Nap hygiene

---

## 6. External Links & Resources

### 6.1 Required Links

- [ ] SomnaHealth website (educational pages)
- [ ] SomnaHealth clinicians
- [ ] ABSM (American Board of Sleep Medicine) certified sleep doctors
- [ ] AASM (American Academy of Sleep Medicine)
- [ ] APA (American Psychological Association) - for trauma/mental health
- [ ] Sleep log page on website
- [ ] Morningness-Eveningness Scale page
- [ ] Healthy bedrooms webpage
- [ ] Urination at night webpage
- [ ] Pain during sleep webpage

### 6.2 Link Contexts

Links should be contextual based on detected issues:

| Detected Issue      | Link To                                |
| ------------------- | -------------------------------------- |
| EDS/Narcolepsy      | Sleep specialist, neurologist          |
| Insomnia            | Behavioral sleep specialist            |
| Circadian issues    | Sleep log, M-E scale, sleep specialist |
| Sleep apnea         | Sleep specialist, ABSM directory       |
| Nighttime urination | Doctor, urination webpage              |
| Pain                | Doctor, pain webpage                   |
| Bedroom issues      | Healthy bedrooms webpage               |
| Nightmares + trauma | Trauma specialist, APA                 |

---

## 7. Technical Requirements

### 7.1 Privacy & Security

- [ ] De-identified data collection only
- [ ] Clear privacy notice at start
- [ ] No PII storage without explicit consent
- [ ] Compliant data handling

### 7.2 Report Delivery

- [ ] PDF generation capability
- [ ] Print-friendly format
- [ ] User-downloadable
- [ ] No permanent storage (user responsible for their copy)

### 7.3 Admin Access

- [ ] Secure admin login
- [ ] Response data viewing
- [ ] CSV export for research
- [ ] Aggregate statistics (optional)

### 7.4 Deployment

- [ ] Vercel deployment
- [ ] Database for response storage
- [ ] Basic data retrieval method

---

## 8. Validation Checklist

Use this section to validate the application against requirements:

### 8.1 Core Functionality

- [ ] Questionnaire completes in ~15 minutes
- [ ] All sections implemented
- [ ] Conditional/branching logic working correctly
- [ ] All calculated metrics accurate (TST, TIB, SE, SOL, WASO, Mid-sleep)
- [ ] Report generates successfully with personalized content
- [ ] PDF export works
- [ ] CSV export works for admin

### 8.2 Content Accuracy

- [ ] Question wording matches psychometrically validated sources
- [ ] All scoring thresholds implemented correctly
- [ ] Disorder detection logic accurate
- [ ] Report messages appropriate and non-diagnostic
- [ ] Safety warnings display when EDS severity > 8

### 8.3 User Experience

- [ ] Mobile responsive
- [ ] Progress indicator
- [ ] Clear navigation
- [ ] Accessible design

### 8.4 Data & Privacy

- [ ] Only collects specified demographic data
- [ ] Privacy notice displayed
- [ ] Admin can access de-identified data
- [ ] CSV export functional

---

## 9. Revision History

| Date    | Version | Description                                  |
| ------- | ------- | -------------------------------------------- |
| Initial | 1.0     | Consolidated from original correspondence    |
| Updated | 1.1     | Added SOW details and questionnaire comments |

---

## Notes

- The questionnaire is based on psychometrically validated instruments - wording is important
- This is a screening tool, not a diagnostic tool - language must reflect this
- "AI/smart" features may be added for adaptive questioning
- Freemium model - consider future monetization paths
- Client responsible for ongoing hosting/database costs after handoff
