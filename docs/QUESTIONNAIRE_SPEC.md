# Sleep Questionnaire - Detailed Specification

This document contains the detailed question structure, scoring logic, and diagnostic criteria for the Sleep Questionnaire.

> **Source**: Extracted from `correspondence/OUTLINE.md`

---

## Introduction Text

Display at the start of the questionnaire:

> The information provided in this questionnaire will be de-identified and not linked to you unless you choose to receive services from our sleep experts. We are bound by federal and state laws and we will never share your identity with anyone unless you provide us with written consent.
>
> You may print out and use the report generated from your sleep data. Once generated you will be responsible for maintaining the security of your report.
>
> Most of these questions apply to the last week. If you were on vacation or sick please think about your most recent typical work/school week.

---

## Section 1: Daytime Symptoms

### Q1a: Planned Naps

**Question**: I take planned naps \_\_\_ days a week for:

- 0-10 minutes
- 15-30 minutes
- 30-90 minutes
- longer than 90 minutes

**Scoring Logic**:

- ≥3 days/week AND ≥30 minutes → **Probable EDS (Excessive Daytime Sleepiness)**
- > 1 day AND ≥30 minutes AND NOT (EDS + insomnia) → Sleep hygiene recommendation: eliminate daytime naps

---

### Q1b: Unplanned Sleep Episodes

**Question**: During a typical week, how often do you fall asleep while: (check all that apply)

| Situation                                            | Score Weight |
| ---------------------------------------------------- | ------------ |
| Stopped at a stop light                              | ×2           |
| During lectures or work meetings                     | ×1           |
| While working or studying                            | ×1           |
| During a conversation                                | ×2           |
| While engaged in a quiet activity during the evening | ×1           |
| While eating a meal                                  | ×2           |

**Scoring Logic**:

- Score 3-6 → Mild EDS, associate with insufficient sleep
- Score >7 → Probable EDS; possible narcolepsy, idiopathic hypersomnia, or other hypersomnia

---

### Q1c: Tiredness Impact

**Question**: My tiredness interferes with my daily activities: Yes / No

**Conditional**: If Yes → show Q1d

---

### Q1d: Tiredness Pattern (conditional)

**Question**: I feel tired but cannot fall asleep:

- Everyday (×2)
- At least 5 days a week (×2)
- Between 3 and 5 days a week (×1)
- 1-3 days a week (×1)
- Less than 1 day a week (×1)

**Scoring Logic**:

- Score >1 → Contribution to insomnia, possible OSA
- Score >2 → Possible contribution to chronic fatigue or post-viral illness

---

### Q1e: Dreams During Sleep Onset

**Question**: I regularly have dreams while falling asleep or during daytime naps.

**Scoring Logic**:

- Yes → Possible narcolepsy, sleep deprivation, or Delayed Sleep Phase

---

### Q1f: Cataplexy Screening

**Question**: When I laugh or feel excited: (check all that apply)

- I feel weak
- I have to brace myself so that I do not fall
- I have fallen down

**Scoring Logic**:

- > 1 checked → Probable cataplexy and Narcolepsy

---

### Q1g: Sleep Paralysis

**Question**: I sometimes wake up and feel like my body is paralyzed

**Scoring Logic**:

- Yes → Possible narcolepsy; provide sleep paralysis information

---

### Q1h: Prior Diagnosis

**Question**: Have you been diagnosed with narcolepsy or hypersomnia (e.g., idiopathic, post viral, post concussion)?

**Type**: Yes/No with optional specification

---

## Section 2: Sleep Schedule

### 2a: Scheduled/Work/School Days

#### Q2a1: Lights Out Time

**Question**: What time do you turn out the lights and try to fall asleep?
**Type**: Time picker (AM/PM)
**Field name**: `bedtime_scheduled`

#### Q2a1a: Bedtime Variability

**Question**: Does your lights out time vary more than 3 hours?
**Type**: Yes/No
**Scoring**: Yes → Consider circadian rhythm disorder (non-24 or free running)

#### Q2a2: Sleep Onset Latency

**Question**: After you turn out the lights, about how long does it take you to fall asleep?
**Type**: Number (minutes)
**Field name**: `sol_scheduled`
**Threshold**: >30 minutes = insomnia indicator

#### Q2a3: Night Wakings

**Question**: About how many times do you wake up during the night prior to your final wake-up?
**Type**: Number
**Conditional**: If >2 → show Q2a3a

#### Q2a3a: Wake Causes (conditional)

**Question**: What wakes you?
**Type**: Multi-select checkboxes

- Need to urinate
- Pain
- Noise or light
- Don't know

**Recommendations by cause**:
| Cause | Recommendation |
|-------|----------------|
| Urinate | Suggest urologist; try ignoring need |
| Pain | Discuss with PCP or sleep specialist |
| Noise/light | Sleep hygiene - correct bedroom environment; stop bed sharing with snorer |
| Don't know | Education; if insomnia → insomnia treatment |

#### Q2a4: Wake After Sleep Onset (WASO)

**Question**: About how many minutes total are you awake during the night?
**Type**: Number (minutes)
**Field name**: `waso_scheduled`
**Threshold**: >40 minutes = insomnia indicator

#### Q2a5: Wake Time

**Question**: What time do you wake up?
**Type**: Time picker (AM/PM)
**Field name**: `wake_time_scheduled`

#### Q2a5a: Out of Bed Time

**Question**: What time do you get out of bed?
**Type**: Time picker (AM/PM)
**Field name**: `out_of_bed_scheduled`

#### Q2a6: Early Morning Awakening

**Question**: How many days a week do you wake up earlier than planned?
**Type**: Number (0-7)
**Conditional**: If >2 → ask "how many minutes earlier?"
**Threshold**: >20 minutes earlier = early morning awakening insomnia

#### Q2a7: Alarm Usage

**Question**: Do you use an alarm clock to wake up in the morning?
**Type**: Yes/No

#### Q2a8: Planned Naps

**Question**: How many planned naps do you take a week?
**Type**: Number
**Conditional**: If >2 → show Q2a9

#### Q2a9: Nap Duration (conditional)

**Question**: How long is your average nap?
**Type**: Number (minutes)

---

### 2b: Unscheduled/Weekend/Vacation Days

_Same structure as 2a with field names:_

- `bedtime_unscheduled`
- `sol_unscheduled`
- `waso_unscheduled`
- `wake_time_unscheduled`
- `out_of_bed_unscheduled`

---

### Sleep Calculations

```
For both weekdays and weekends:

Total Sleep Time (TST) = (Lights out time - Wake time) - SOL - WASO
Time in Bed (TIB) = Lights out - Wake time (in minutes)
Sleep Efficiency = (TST / TIB) × 100
Mid-sleep Time = Wake time - (TST / 2)
```

---

### Sleep Diagnostics Logic

#### Insomnia Detection

```
IF (SOL > 30 min AND ≥3 days/week)  // Sleep onset insomnia
   OR (wakings > 5/week)
   OR (WASO > 40 min AND ≥3 days/week)  // Sleep maintenance insomnia
   AND (daytime tiredness > 3 days/week)
THEN → Insomnia

IF duration < 6 months → Short-term insomnia
IF associated with sentinel event → Query anxiety/trauma/depression/medication/other illness
IF duration > 6 months → Chronic insomnia
```

#### Circadian Rhythm - DSPD (Delayed Sleep Phase)

```
IF mid-sleep time > 4am (weekdays)
   AND/OR weekend mid-sleep is >2 hours later than weekday
   AND preference for evening chronotype
THEN → Probable DSPD
```

#### Circadian Rhythm - ASPD (Advanced Sleep Phase)

```
IF mid-sleep time < 1am
   AND preference for morning chronotype
THEN → Possible ASPD
```

#### Circadian Rhythm - Non-24/Free Running

```
IF bedtime varies > 3 hours on weeknights (Q2a1a = Yes)
THEN → Consider circadian rhythm disorder
```

---

## Section 3: Breathing Disorders

### Q3: Prior Diagnosis

**Question**: Have you been diagnosed with a sleep-related breathing disorder (Obstructive sleep apnea, primary snoring, central sleep apnea)?
**Type**: Yes/No

#### Q3a: Severity (conditional if Q3 = Yes)

**Question**: If yes, is your problem mild, moderate, or severe?
**Type**: Select (Mild/Moderate/Severe)

#### Q3a2: Treatment (conditional if Q3 = Yes)

**Question**: Are you treated for your sleep and breathing problem?
**Type**: Multi-select

- CPAP
- Dental appliance
- Other (specify)

### Q3b: Snoring

**Question**: Have you been told that you snore?
**Type**: Yes/No

### Q3b1: Breathing Interruptions

**Question**: Have you been told that you stop breathing, snort or gasp for air during sleep?
**Type**: Yes/No

### Q3c: Mouth Breathing

**Question**: Do you mouth breathe?
**Type**: Yes/No

#### Q3c1: Dry Mouth (conditional if Q3c = Yes)

**Question**: Do you frequently wake up with a dry mouth?
**Type**: Yes/No

---

### Breathing Disorders Report Text

**If diagnosed and treated**:

> You have been diagnosed and treated and you are clearly committed to your sleep health.

**If symptoms present OR diagnosed but untreated**:

> You have been diagnosed/you have not been diagnosed and based on our questionnaire we strongly recommend that you/and you have symptoms of sleep disordered breathing. We strongly encourage you to discuss treatment options with your sleep specialist or primary care doctor. We can provide consultation on next steps [link to coaching with DBSM or sleep doc] or you can use these links to identify a sleep provider in your area [link to ABSM listing of certified sleep docs].

---

## Section 4: Restless Legs Syndrome

### Q4: Prior Diagnosis

**Question**: Have you been diagnosed with restless legs syndrome (RLS) or periodic limb movement disorder?
**Type**: Yes/No

#### Q4 Treatment (conditional if Q4 = Yes)

**Question**: Are you being treated for RLS?
**Type**: Yes/No with treatment specification

- Iron supplements
- Dopamine agonists
- Gabapentin
- Other (specify)

### Q4a: Lying Still

**Question**: Do you have trouble lying still while trying to fall asleep at night?
**Type**: Yes/No

### Q4b: Urge to Move

**Question**: Do you have an urge to move your legs while lying in bed at night?
**Type**: Yes/No

### Q4c: Relief with Movement

**Question**: Does movement relieve the uncomfortable feelings in your legs?
**Type**: Yes/No

### Q4d: Daytime Symptoms

**Question**: Do you have leg discomfort during the day?
**Type**: Yes/No

---

### RLS Report Text

**If diagnosed**:

> You have been diagnosed with Restless Legs Syndrome (RLS) and your treatment is important for optimal quality sleep.

**Educational content (always include)**:

> Restless legs syndrome is a relatively common disorder that increases discomfort in bed and interferes with your ability to fall asleep. RLS can be associated with insufficient availability or uptake of dopamine (a brain chemical), and low levels of ferritin (sometimes even when iron levels are normal). It can also occur during pregnancy or as an unwanted effect of some medications including SSRIs. RLS is often exacerbated when someone is sleep deprived, using excessive caffeine, or experiencing increased stress. After evaluation by a physician, a common and safe treatment for some individuals is supplementation with specific forms of iron (ferritin).

**Clinical note for physicians**:

> Supplementation with ferrous gluconate or ferrous sulfate between 3-6mg/kg of elemental iron for individuals who are symptomatic and have ferritin levels below 75mcg/ml. Other treatments can include dopamine agonists, pain management (e.g., gabapentin).

---

## Section 5: Parasomnias

### Q5: Night Behaviors

**Question**: Have you been told that you wake in the middle of the night and: (check all that apply)

- Walk
- Talk
- Appear confused
- Are very upset and cannot be calmed

### Q5a: Memory of Events (conditional if Q5 has selections)

**Question**: Do you have a clear memory of these events?
**Type**: Yes/No

### Q5a1: Acting Out Dreams

**Question**: Do you act out your dreams?
**Type**: Yes/No

**Scoring**: Yes → Evaluate for REM Behavioral Disorder (more common in men >65)

### Q5b: Bed Wetting

**Question**: Do you wet the bed more than 1 night per month?
**Type**: Yes/No

**Scoring**: Yes → Recommend discussion with PCP, sleep specialist, or endocrinologist

### Q5c: Prior Parasomnia Diagnosis

**Question**: Have you been diagnosed with a parasomnia?
**Type**: Yes/No

#### Q5d: Parasomnia Type (conditional if Q5c = Yes)

**Question**: Which parasomnia?
**Type**: Text input

#### Q5e: Parasomnia Treatment (conditional if Q5c = Yes)

**Question**: Have you received treatment for a parasomnia?
**Type**: Yes/No with treatment type specification

---

### Parasomnia Report Text

**REM Behavioral Disorder warning**:

> Your answers suggest that you should be evaluated for a relatively rare sleep disorder called REM Behavioral Disorder (this is more common among men who are over the age of 65). The immediate risk associated with this disorder is injury to yourself or a bed partner. We suggest that you prioritize discussing your symptoms with a sleep specialist or a neurologist who may order a sleep study or conduct other testing to identify the underlying causes of RBD. There are safe medications that can improve symptoms of this rare condition. [Links to sleep doctors in your area - AASM]

**Safety recommendation for parasomnias**:

> The most important initial step is for you to assure your safety and others who live in your home. While rare, some parasomnias (nocturnal eating and cooking, sleep walking) can result in injuries. Until you receive treatment from a sleep specialist [our link for consultation or treatment] take safety measures by using alarms and alerting others in your home that you should be observed or calmly guided back to bed.

---

## Section 6: Nightmares

### Q6: Nightmare Occurrence

**Question**: Do you have nightmares?
**Type**: Yes/No

### Q6a: Nightmare Frequency (conditional if Q6 = Yes)

**Question**: On how many nights a week do you have nightmares?
**Type**: Number (0-7)

### Q6b: Trauma Association (conditional if Q6 = Yes)

**Question**: Are your nightmares associated with exposure to trauma or a history of post-traumatic stress disorder (PTSD)?
**Type**: Yes/No

---

### Nightmare Report Text

**If frequency ≥3 nights/week**:

> Frequent nightmares can be distressing and associated with stress, trauma and mood disturbance. If your nightmares are distressing, we suggest that you consult with a behavioral sleep specialist [link to our team – coaching or Tx]. There are effective treatments for nightmare disorders and when they are persistent, a sleep specialist [link to our Tx team and to ABSM] or psychiatrist [link] may suggest a trial of a medication.

**If frequency <3 nights/week**:

> Nightmares can disturb sleep and can cause distress during the day. If you experience distress as a result of your nightmares, we recommend that you consult with a behavioral sleep specialist or mental health professional [our link and link to BSM and APA].

**If trauma/PTSD associated (add to above)**:

> Trauma and PTSD are serious mental health challenges that require treatment by a provider who specializes in treatment of trauma [link to APA]. Nightmares are one of many symptoms of PTSD and trauma and for most people treatment of PTSD with evidence-based therapies is a high priority.

---

## Section 7: Chronotype

### Q7: Sleep Preference

**Question**: Do you prefer to:

- a. Go to bed early and wake up early
- b. Go to bed late and wake up late
- c. I have no preference and have a flexible sleep schedule

### Q7.1: Shift Work

**Question**: Does your job require you to do shift work?
**Type**: Yes/No

#### Q7.1 Details (conditional if Yes)

**Questions**:

- What type of shift? (rotating, evenings, graveyard)
- How many days a week?

### Q7.2: Past Shift Work

**Question**: I do not currently do shift work, but I did shift work for \_\_\_ years
**Type**: Number (years)

### Q7.3: Time Zone Travel

**Question**: I travel across time zones more than 1 time a month
**Type**: Yes/No

### Q7.4: Work/School Start Time

**Question**: On scheduled/work/school days, what time do you have to be at work/school?
**Type**: Time picker OR "It varies a few hours every day"

---

### Chronotype Report Text

**DSPD (if Q7 = b AND SOL > 30 AND mid-sleep > 4am AND daytime sleepiness/tiredness)**:

> You have symptoms of Circadian Rhythm Disorders Delayed Sleep Phase Syndrome. This disorder can account for difficulty waking in the morning resulting in your being late to school or work, daytime tiredness particularly when your work/school schedule requires you to wake early. You may have difficulty falling asleep and feel a strong urge to nap in the afternoon. These problems can be particularly common between 12 and 25 years of age, but can impact all people. Because these problems are associated with both sleep disruption and disruption of daytime functioning, we suggest that you consider a consultation with a sleep specialist [our links and links to DBSM].

**ASPD (if Q7 = a AND mid-sleep < 12am AND waking earlier than desired AND EDS)**:

> You have symptoms of Circadian Rhythm Disorders Advanced Sleep Phase Syndrome. This disorder becomes increasingly common for those who are >70 years of age. Because you are struggling with your current sleep schedule you may want to consider a consultation with a behavioral sleep specialist [our links and BSM].

---

## Section 8: Sleep Medications & Supplements

### Q8: Medication Use

**Question**: I take supplements and/or prescribed sleep medications to help me sleep.
**Type**: Yes/No

### Q8a: Supplements/OTC (conditional if Q8 = Yes)

**Question**: What supplements/over the counter medications do you take for sleep?
**Type**: Multi-select with checkboxes

- Melatonin
- Benadryl (diphenhydramine)
- Tylenol or Advil PM
- NyQuil
- Unisom (doxylamine succinate)
- Magnesium
- L-theanine
- Valerian root
- CBD
- Other (specify)

### Q8b: Prescription Medications (conditional if Q8 = Yes)

**Question**: What prescription medications do you take for sleep?
**Type**: Multi-select with categories

**Benzodiazepines**:

- ProSom/Estazolam
- Dalmane/Flurazepam
- Restoril/Temazepam
- Halcion/Triazolam

**Non-benzodiazepine hypnotics**:

- Ambien/zolpidem
- Lunesta/eszopiclone
- Sonata/zaleplon

**Dual Orexin Receptor Antagonists**:

- Quviviq/daridorexant
- Dayvigo/Lemborexant
- Belsomra/suvorexant

**Antidepressants with sedative properties**:

- Trazodone
- Mirtazapine
- Doxepin
- Amitriptyline

**Melatonin Receptor Agonists**:

- Rozerem/ramelteon

**Antipsychotic medications**:

- Seroquel/Quetiapine
- Zyprexa/Olanzapine
- Risperdal/Risperidone

### Q8c: Stimulants

**Question**: Are you prescribed stimulants?
**Type**: Yes/No

#### Q8c Details (conditional if Yes)

- What is the stimulant?
- What time do you take it?

### Q8d: Nicotine

**Question**: Do you smoke cigarettes or use nicotine patches?
**Type**: Yes/No

---

## Section 9: Bedroom Environment

### Q9: Environment Ratings

**Question**: Please rate your bedroom/the place that you typically sleep on a scale of 1-10 (1 = worst, 10 = best)

| Aspect                                    | Rating (1-10) |
| ----------------------------------------- | ------------- |
| Q9a: Relaxing and comfortable environment | [ ]           |
| Q9b: Comfortable bed and bedding          | [ ]           |
| Q9c: Dark                                 | [ ]           |
| Q9d: Quiet                                | [ ]           |

---

## Section 10: Caffeine

### Q10: Caffeine Consumption

**Question**: How many cups of caffeinated beverages (coffee, tea, iced tea, sodas, chocolate) do you drink per day?
**Type**: Number

### Q10a: Last Caffeine

**Question**: What time do you have your final caffeinated beverage?
**Type**: Time picker

---

## Section 11: Alcohol

### Q11: Alcohol Consumption

**Question**: How much alcohol do you drink on a weekly basis?

- Glasses of wine: \_\_\_
- Cocktails: \_\_\_
- Beers: \_\_\_

---

## Section 12: Exercise

### Q12: Exercise Frequency

**Question**: How many days do you exercise during a typical week?
**Type**: Number (0-7)

### Q12a: Exercise Duration

**Question**: How long do you exercise?
**Type**: Number (minutes)

### Q12b: Exercise Timing

**Question**: What time does your exercise end?
**Type**: Time picker

---

## Section 13: Medical History

### Q13: Medical Conditions

**Question**: Have you been diagnosed with/are you being treated for any of the following medical problems?
**Type**: Multi-select checklist

_(Specific conditions to be defined)_

---

## Section 14: Mental Health

### Q14: Mental Health Conditions

**Question**: Have you been diagnosed with/are you being treated for any of the following mental health problems?
**Type**: Multi-select checklist

_(Specific conditions to be defined)_

---

## Section 15: Sleep-Related Anxiety

### Q15: Pre-Sleep Worry

**Question**: Do worries about the next day often contribute to difficulty falling asleep or extend your nighttime awakenings?
**Type**: Yes/No

### Q15a: Anxiety/Rumination

**Question**: Do you have anxiety or persistent rumination while in bed at night?
**Type**: Yes/No

### Q15b: Time in Bed Trying to Sleep

**Question**: Do you spend time in bed trying to sleep?
**Type**: Yes/No

### Q15c: Activity Cancellation

**Question**: How often do you cancel activities following a night of poor sleep?

- Never
- 1-2 times a week
- 3 or more times a week

---

### Sleep Anxiety Report Text

**If Q15 = Yes AND Q15a = Yes**:

> It is likely that your anxiety related to sleep is interfering with your ability to surrender to sleep at night.

**If Q15c ≥ 1-2 times a week**:
→ Indicates Moderate to severe insomnia

---

## Report Template

### Opening Paragraph

> Thank you for completing the SomnaHealth comprehensive sleep questionnaire. With more than 4 decades of collective experience, our team created the questionnaire and this personalized report to provide you with guidance on improving your sleep health. The report provides a personalized summary of your sleep health which includes sleep habits and suspected sleep disorders.

### Personalized Summary Template

> Dear [Name],
>
> On average you sleep [#] hours a night on weekends and [#] hours on weekdays. The time that it takes you to fall asleep is [prolonged/short/normal]. You wake approximately [#] times a night and are awake for [#] minutes on average which is [prolonged/normal]. Your sleep efficiency, a measure of insomnia, is [#]% which is [in the normal range (≥85%)/low (<85%)]. Your sleep varies [very little/significantly] between weekends and weekdays.
>
> Based on your sleep schedule (mid-sleep point [#], weekend vs. weekday variability), you appear to be an [evening – go to bed late and wake up late / morning – go to bed early and wake up early / chronoflex] chronotype.
>
> During the day you have [no significant/mild/moderate/severe] daytime sleepiness and your daytime tiredness is [not a problem/mild/moderate/severe].
>
> Based on your responses, your sleep hygiene is [good/could improve/may contribute to sleep challenges].
>
> [Caffeine use assessment]
> [Alcohol use assessment]
> [Daytime nap assessment]

### Insomnia Section Template

**If insomnia detected**:

> You [do/do not] have symptoms of insomnia. Insomnia is defined as difficulty falling asleep and/or staying asleep and/or poor sleep quality associated with daytime tiredness and other disturbances in daytime function. Your symptoms of insomnia include [difficulty falling asleep >30 minutes / multiple nighttime awakenings that last longer than 45 minutes / general sleep disturbance], associated with [moderate/mild] daytime tiredness and sleep-related disturbances. We provide comprehensive treatment of insomnia using cognitive behavioral therapy for insomnia.

**If no insomnia**:

> Even though you do not have insomnia there are some general tips that might improve your sleep. These include [a regular sleep schedule, improved sleep hygiene, etc.]

### Prior Diagnosis Section

> [You have been previously diagnosed with X and are/are not currently receiving treatment for this disorder.]

### Possible Diagnoses List

- Sleep disordered breathing – obstructive sleep apnea and primary snoring
- Parasomnias – sleep walking, talking, sleep terrors, sleep eating, sexsomnia, REM behavioral disorder
- Circadian rhythm disorder
- Sleep related movement disorder – RLS
- Dependence on sleeping pills

### THC/Cannabis Warning

> If you use THC or other medicines to address anxiety or sleep problems, it is important to understand that THC and other medicine have a direct impact on your sleep stages and result in short-term withdrawal effects.

---

## Appendix: Field Reference

| Field ID                | Section | Type    | Used In Calculation |
| ----------------------- | ------- | ------- | ------------------- |
| `bedtime_scheduled`     | 2a      | Time    | TST, TIB, Mid-sleep |
| `sol_scheduled`         | 2a      | Minutes | TST, Insomnia       |
| `waso_scheduled`        | 2a      | Minutes | TST, Insomnia       |
| `wake_time_scheduled`   | 2a      | Time    | TST, TIB, Mid-sleep |
| `bedtime_unscheduled`   | 2b      | Time    | TST, TIB, Mid-sleep |
| `sol_unscheduled`       | 2b      | Minutes | TST, Insomnia       |
| `waso_unscheduled`      | 2b      | Minutes | TST, Insomnia       |
| `wake_time_unscheduled` | 2b      | Time    | TST, TIB, Mid-sleep |
