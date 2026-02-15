# Sleep Assessment — Revision Changelog

Summary of all user-visible changes made based on reviewer feedback (Rounds 1 and 2).

---

## Global Changes (All Pages)

- **SomnaHealth branding** added to the top of every page (moon icon + "SomnaHealth" text)
- **Copyright notice** added to the bottom of every page: "© 2026 SomnaHealth. All rights reserved."
- **Copy protection** added: text selection is disabled on questionnaire content (excluding form inputs), right-click is blocked on non-input elements, and copy/cut clipboard operations are prevented on content areas
- **"Pre-fill & Jump to Report" dev button** now only appears in development mode (removed the separate environment variable toggle that could expose it in production)
- **Section count** changed from 15 to 16 steps (new Sleep Disorder History section added)

---

## Page 1: Welcome (Intro)

- No changes to content. SomnaHealth branding and copyright now visible.

---

## Page 2: Sleep Disorder History *(NEW PAGE)*

- **Entirely new section** added as the second step in the questionnaire
- Presents a checklist of 14 sleep disorders (checkboxes, not yes/no toggles):
  - Insomnia Disorder
  - Obstructive Sleep Apnea Syndrome
  - Central Sleep Apnea Syndrome
  - Restless Leg Syndrome
  - Periodic Limb Movement Disorder
  - Circadian Rhythm Disorder (Delayed or Advanced Sleep Phase)
  - Narcolepsy
  - Idiopathic Hypersomnia
  - Nightmare Disorder
  - Parasomnia (sleepwalking or night terrors)
  - Enuresis (bedwetting)
  - REM Behavioral Disorder
  - Insufficient Sleep
  - None of the above
- **"None of the above" mutual exclusion**: checking it unchecks all others; checking any disorder unchecks "None"
- **"Other" write-in field** with 25-character limit
- Instruction text: "Have you been previously diagnosed with any of the following sleep disorders? Check all that apply."

---

## Page 3: Daytime Energy and Alertness *(was "Daytime Feelings")*

- **Title changed** from "Daytime Feelings" → "Daytime Energy and Alertness"
- **Subtitle changed** to: "Remember to think about the average over a typical week."
- **Tiredness questions replaced** — The old "My tiredness interferes with my daily activities" checkbox, severity slider, and "I feel tired but cannot fall asleep" radio have been replaced with **4 separate 1–10 scale sliders**:
  1. "I experience sleepiness (heavy eyes, the urge to fall asleep)…" (1=Never → 10=Often)
  2. "My sleepiness interferes with my daily activities…" (same scale)
  3. "I experience fatigue/tiredness (feeling of physical or mental exhaustion or very low energy)…" (same scale)
  4. "My fatigue/tiredness interferes with my daily activities…" (same scale)
- **Sleep paralysis follow-up added**: When "I sometimes wake up and feel like my body is paralyzed" is checked, a new question appears: "How many times in the last month have you experienced sleep paralysis?" (0–30 number input)
- **Non-restorative sleep description changed** from "Non-restorative sleep can indicate underlying conditions" to "Non-restorative sleep can reflect misconceptions about sleep that are common with insomnia."
- **Muscle/joint pain question** now only appears when "Pain affects my ability to fall asleep or stay asleep" is checked (was always visible)
- **Safety warning updated**: Now triggers when sleepiness interference OR fatigue interference is rated 8 or higher (was based on old single tiredness severity score)

---

## Page 4: Sleep on Work/School Days

- **New first question added**: "What time do you typically get into bed on work/school nights?" (appears before the lights-out question — helps identify possible insomnia)
- **"Typically" added** to all question labels throughout the section (e.g., "What time do you typically turn out the lights…", "About how long does it typically take you to fall asleep?")
- **Wake-during-night question reworded**: Now reads "About how many minutes total are you typically awake during the night before your final awakening? (total wake time after falling asleep)"
- **Time validation warnings added**: 
  - If bedtime is outside 8:30 PM – 2:00 AM range → amber warning: "This bedtime seems unusual. Please double-check that you entered the correct time."
  - If wake time is outside 5:00 AM – 11:00 AM range → similar warning

---

## Page 5: Sleep on Weekends/Free Days

- **Same changes as Page 4**: new bedtime question, "typically" wording throughout, clarified WASO question, time validation warnings

---

## Page 6: Sleep Related Breathing Difficulties *(was "Sleep Related Breathing Disorders")*

- **Title changed** to "Sleep Related Breathing Difficulties"
- **Informational text added** describing Obstructive Sleep Apnea Syndrome and Central Sleep Apnea Syndrome — includes risk factors (excess weight, large neck circumference, anatomical features) and health consequences (high blood pressure, heart disease, stroke, excessive daytime sleepiness)
- **Mouth breathing split into two separate questions**:
  1. "I often wake up with a dry mouth" (standalone — no longer hidden behind a parent question; this is a symptom of sleep apnea)
  2. "I typically breathe through my mouth during the day" (new — reflects nasal congestion/obstruction)
- **Morning headache question added**: "I often wake up with a headache in the morning" (common symptom of undiagnosed OSA)
- **Airway crowding questions added**: "Have you had any of the following?" checklist — Wisdom teeth extraction, Orthodontic treatment, Tonsillectomy
- **Warning popup text changed** to: "Based on your response, you may have a sleep and breathing problem or disorder. We strongly recommend that you discuss this with your sleep specialist or primary care doctor."
- **Warning now also triggers** when both dry mouth AND daytime mouth breathing are checked (previously only triggered on snoring/stops breathing)

---

## Page 7: Movement Disorders *(was "Restless Legs")*

- **Title changed** from "Restless Legs" → "Movement Disorders"
- **Subtitle changed** to "Restless Legs Syndrome (RLS) and Periodic Limb Movements"
- **Questions condensed from 3 to 2** (with evening time frame added):
  1. "It is hard to sit still before bedtime and/or lie still when trying to fall asleep at night because of discomfort in my legs."
  2. "The discomfort in my legs is relieved when I stretch or move around."
- **Conditional follow-up questions added**: When BOTH questions above are answered yes, 3 additional questions appear:
  - How often do you experience these symptoms? (Every night / Most nights / Some nights / Rarely)
  - How severe are your symptoms? (1–10 scale)
  - When do your symptoms typically begin? (Evening / At bedtime / Both)
- Daytime discomfort question remains

---

## Page 8: Sleep Behaviors (Parasomnias)

- **Info text updated** to: "Parasomnias (Night Terrors, Sleepwalking, Sleep Eating) are unusual behaviors during sleep that can affect your safety and sleep quality."
- **Normalizing note added**: "Note: Sleep talking is very common and usually not a cause for concern."
- **Diagnosis questions removed**: The "Have you been diagnosed with a parasomnia?" question and its follow-ups (which parasomnia, treatment received, treatment type) have been removed — these are now handled by the Sleep Disorder History section (Page 2)

---

## Page 9: Understanding Bad Dreams vs Nightmares *(was "Nightmares and Dream Disturbances")*

- **Title changed** from "Nightmares and Dream Disturbances" → "Understanding Bad Dreams vs Nightmares"

---

## Page 10: Sleep Schedule Preferences *(was "Sleep Preferences and Schedule")*

- **Title changed** to "Sleep Schedule Preferences"
- **Subtitle added**: "Chronotype or Circadian Sleep Timing"
- **Clock time markers added** to preference options:
  - Early: "(bedtime 8:00 PM or earlier, wake time 4:00 AM or earlier)"
  - Late: "(bedtime 12:00 AM or later, wake time 8:00 AM or later)"
- **"Flexible schedule" option reworded** to: "I have no preference for when I go to bed or wake up"
- **Social jet lag question added**: "My work/school schedule requires me to go to bed and wake up at very different times than I would like (2 or more hours difference)"
- **Jet lag question revised**: Changed from a simple yes/no "Do you travel across time zones more than 1 time a month?" to: "How many times per year do you travel across time zones?" (number input). If more than 3 times, a follow-up appears: "Do you have trouble adjusting to the time change after travel?"
- **Work/school time question reworded** to: "What is your earliest work/school start time in the morning?" with description "Leave blank if you do not have to be up in the morning."

---

## Page 11: Sleep Medications & Supplements

- **OTC medications reorganized** into two labeled columns:
  - **OTC Sleep Aids**: Melatonin, Benadryl (diphenhydramine), NyQuil, Unisom (doxylamine succinate), Tylenol PM / Advil PM
  - **Supplements**: L-theanine, CBD, Magnesium, Valerian root
- **Prescription medications expanded** with full generic and brand names:
  - Benzodiazepines: added Lorazepam (Ativan), Diazepam (Valium), Clonazepam (Klonopin) alongside existing entries
  - All entries now show both generic and brand names (e.g., "Zolpidem (Ambien)")
- **New section added**: "Are you taking any medications that can affect sleep?" with options:
  - SSRIs/SNRIs (e.g., Lexapro/escitalopram, Zoloft/sertraline, Effexor/venlafaxine, Cymbalta/duloxetine)
  - Steroids (e.g., Prednisone)
  - PDE-5 inhibitors (e.g., Sildenafil/Viagra, Tadalafil/Cialis)
  - Antihistamines (e.g., Cetirizine/Zyrtec, Loratadine/Claritin)
  - Antiemetics (e.g., Ondansetron/Zofran, Metoclopramide/Reglan)
- **Nicotine question removed** from this page (moved to Lifestyle Factors)

---

## Page 12: Bedroom Environment

- **First question simplified**: Changed from "How relaxing and comfortable is your bedroom environment?" to "How relaxing is your bedroom environment?" (since "comfortable" is addressed by the separate bed/bedding question)
- **Temperature question added**: "How comfortable is the temperature in your bedroom?" (1–10 scale)
- **Safety question added**: "How safe do you feel in your bedroom?" (1–10 scale)
- **Overall score** now averages 6 factors (was 4): relaxing, comfortable bed, dark, quiet, temperature, safety

---

## Page 13: Lifestyle Factors

- **Nicotine section added** (moved from Medications page): "Do you smoke cigarettes or use nicotine products (patches, vape, etc.)?" with warning when checked
- **Alcohol timing question added**: "What time do you typically have your last alcoholic drink?" (appears when alcohol consumption is greater than 0)
- **Meal timing section added**:
  - "What time does your last meal of the day typically end?"
  - "Do you snack after dinner and within an hour of bedtime?"
  - Warning triggers when last meal is after 9:00 PM or snacking before bed: "Eating late or snacking close to bedtime can contribute to poor sleep quality and may worsen acid reflux symptoms."

---

## Page 14: Mental Health & Sleep

- **"Check all that apply" instructions** added to both the medical conditions and mental health conditions checklists
- **Worry questions reworded** for clinical specificity:
  - First question: "Worries about the next day often contribute to my difficulty falling asleep" (was "Do worries about the next day often contribute to difficulty falling asleep or extend your nighttime awakenings?")
  - Second question: "I have anxiety or persistent ruminations when awake at night" (was "Do you have anxiety or persistent rumination while in bed at night?")
- **Medical conditions expanded**:
  - Added "Indoor/outdoor allergies"
  - Added "Seizure disorder / Epilepsy"
  - "GERD / Acid reflux" expanded to "GERD / IBS / Acid reflux"
- **Mental health conditions expanded**:
  - Added "Autism Spectrum Disorder (ASD)"
  - Abbreviated names spelled out: "Post-Traumatic Stress Disorder (PTSD)", "Obsessive-Compulsive Disorder (OCD)", "Attention-Deficit/Hyperactivity Disorder (ADHD)"

---

## Page 15: About You (Demographics)

- **Privacy note added** at the top: "These questions are important for diagnostic considerations. We are not collecting any identifiable personal data — your responses are de-identified and used only to provide personalized sleep health recommendations."
- Demographics remain at end of questionnaire (per additional reviewer guidance)

---

## Page 16: Your Sleep Report

- **New intro text**: "At SomnaHealth, our mission is to help you sleep better and live healthier because optimal sleep is the foundation of lifelong wellness. That's why we offer free tools and easy-to-understand guidance from our team of board-certified sleep experts. Whether you want to improve your nightly rest or address a specific sleep issue, we're here to help. We have provided a personalized set of links to where there are free resources, and a few premium options and links to our board certified sleep experts."
- **Chronotype label added** to Sleep Metrics section: displays "Morning Lark", "Night Owl", or "Neutral" with description
- **"Your Previous Diagnoses" section added**: For each disorder checked on the Sleep Disorder History page, the report now shows:
  - "You indicated that you have been diagnosed with [disorder name]."
  - Cross-references questionnaire data (e.g., for OSA: "The data you provided confirms you are being treated for this condition" if treatment is indicated, or "We strongly recommend discussing treatment options" if not)
  - Links to ABSM and SBSM specialist directories
- **Sleep paralysis in report**: If sleep paralysis frequency > 4 per month, adds "Frequent Sleep Paralysis" to identified issues with recommendation for evaluation
- **OSA logic fixed**: If user reported being diagnosed with AND treated for OSA, report now recommends follow-up/continuation rather than new evaluation. If symptoms suggest OSA but no diagnosis, recommends evaluation.
- **Sleepiness/fatigue reporting updated**: Report now uses the 4 separate sleepiness/fatigue scales for severity assessments instead of the old single tiredness measure
- **SomnaHealth website links** now appear in every report regardless of findings (even if no issues detected)
- **Enhanced SomnaHealth branding** at report header
- **Copyright** at bottom of report
- **Navigation fix**: "Generate Report" button no longer triggers strict form validation, preventing the "jumpy" behavior where the form would scroll to invisible error fields on other pages

---

## Deferred Items (Not Implemented — Flagged for Future)

- **Zipcode → SES demographic coding**: Mapping zip codes to state/county/SES index for severity adjustment. Reviewer explicitly said this can be deferred ("don't worry about it if complicated"). Can be added to data analysis pipeline later.
- **Screenshot prevention**: True screenshot prevention is impossible in browsers. Copy/paste and text selection deterrents are implemented, but OS-level screenshots cannot be blocked. This is a known limitation of web-based applications.
- **In-person report review session**: Reviewer suggested working through diagnostic criteria together in person — this is a collaborative session, not an implementation item.
- **Mandatory core question validation**: The "Generate Report" navigation was fixed to prevent jumping, but strict per-field validation requiring minimum completion before generating a report was not added. This could be added in a future iteration to ensure respondents cannot skip to the report without answering core questions.
