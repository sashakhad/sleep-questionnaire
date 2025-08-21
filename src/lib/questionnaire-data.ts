export interface QuestionnaireSection {
  id: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'radio' | 'checkbox' | 'number' | 'time' | 'text' | 'scale';
  options?: Option[];
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  subQuestions?: Question[];
  condition?: string; // Conditional logic for showing question
}

export interface Option {
  value: string;
  label: string;
  score?: number;
}

export const questionnaireData: QuestionnaireSection[] = [
  {
    id: 'section1',
    title: 'Daytime Sleepiness',
    questions: [
      {
        id: '1.1',
        text: 'Do you take planned naps during the day?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        subQuestions: [
          {
            id: '1.1a',
            text: 'How many days per week?',
            type: 'number',
            min: 0,
            max: 7,
            condition: '1.1 === "yes"'
          },
          {
            id: '1.1b',
            text: 'How long is your usual nap?',
            type: 'radio',
            options: [
              { value: '0-20', label: '0-20 mins' },
              { value: '21-45', label: '21-45 mins' },
              { value: '46-90', label: '46-90 mins' },
              { value: '90+', label: '90+ mins' }
            ],
            condition: '1.1 === "yes"'
          }
        ]
      },
      {
        id: '1.2',
        text: 'Do you ever doze off when you shouldn\'t? (Tick all that apply)',
        type: 'checkbox',
        options: [
          { value: 'traffic', label: 'At traffic lights', score: 1 },
          { value: 'meetings', label: 'Meetings/lectures', score: 1 },
          { value: 'working', label: 'Working/studying', score: 1 },
          { value: 'talking', label: 'Talking', score: 2 },
          { value: 'quiet', label: 'Quiet activities in evening', score: 1 },
          { value: 'eating', label: 'Eating a meal', score: 2 }
        ]
      },
      {
        id: '1.3',
        text: 'Does tiredness interfere with daily activities?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        subQuestions: [
          {
            id: '1.3a',
            text: 'If yes, how severe is the interference? (1=a nuisance, 10=a safety concern)',
            type: 'scale',
            min: 1,
            max: 10,
            condition: '1.3 === "yes"'
          }
        ]
      },
      {
        id: '1.4',
        text: 'Do you feel tired but can\'t nap?',
        type: 'radio',
        options: [
          { value: 'everyday', label: 'Everyday' },
          { value: '5+', label: '5+ days/week' },
          { value: '3-5', label: '3-5 days/week' },
          { value: '1-3', label: '1-3 days/week' },
          { value: '<1', label: 'Less than 1 day/week' }
        ]
      },
      {
        id: '1.5',
        text: 'Do you dream as you fall asleep or during naps?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: '1.6',
        text: 'Do you feel weak or lose muscle control when laughing or excited?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: '1.7',
        text: 'Do you ever wake up and feel paralysed?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: '1.8',
        text: 'Have you ever been diagnosed with Narcolepsy or Hypersomnia?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  },
  {
    id: 'section2',
    title: 'Night-Time Sleep',
    questions: [
      {
        id: '2.1',
        text: 'On a typical weeknight (work/school day), what time do you turn out the lights and try to fall asleep?',
        type: 'time',
        placeholder: '10:30 PM'
      },
      {
        id: '2.1a',
        text: 'What time do you get into bed?',
        type: 'time',
        placeholder: '10:00 PM'
      },
      {
        id: '2.1b',
        text: 'Does your bedtime vary by more than 1.5 hours from night to night?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: '2.1c',
        text: 'On a typical weekend night (free day), what time do you turn out the lights and try to fall asleep?',
        type: 'time',
        placeholder: '11:30 PM'
      },
      {
        id: '2.2',
        text: 'How long does it take to fall asleep? (minutes)',
        type: 'number',
        min: 0,
        max: 300,
        placeholder: '15'
      },
      {
        id: '2.3',
        text: 'How many times do you wake up in the night?',
        type: 'number',
        min: 0,
        max: 20,
        placeholder: '1'
      },
      {
        id: '2.3a',
        text: 'What wakes you? (Tick all that apply)',
        type: 'checkbox',
        options: [
          { value: 'pee', label: 'Need to pee' },
          { value: 'pain', label: 'Pain' },
          { value: 'noise', label: 'Noise/Light' },
          { value: 'unknown', label: 'Don\'t know' }
        ]
      },
      {
        id: '2.4',
        text: 'How many total minutes are you awake during the night?',
        type: 'number',
        min: 0,
        max: 480,
        placeholder: '20'
      },
      {
        id: '2.5',
        text: 'What time do you wake up on weekdays?',
        type: 'time',
        placeholder: '7:00 AM'
      },
      {
        id: '2.5a',
        text: 'What time do you wake up on weekends?',
        type: 'time',
        placeholder: '8:30 AM'
      },
      {
        id: '2.6',
        text: 'What time do you get out of bed on weekdays?',
        type: 'time',
        placeholder: '7:15 AM'
      },
      {
        id: '2.6a',
        text: 'What time do you get out of bed on weekends?',
        type: 'time',
        placeholder: '9:00 AM'
      },
      {
        id: '2.7',
        text: 'How many days/week do you wake earlier than planned?',
        type: 'number',
        min: 0,
        max: 7,
        placeholder: '2'
      },
      {
        id: '2.7a',
        text: 'How many minutes early?',
        type: 'number',
        min: 0,
        max: 300,
        placeholder: '30',
        condition: '2.7 > 0'
      },
      {
        id: '2.8',
        text: 'Do you use an alarm clock?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  },
  {
    id: 'section3',
    title: 'Breathing Issues',
    questions: [
      {
        id: '3.1',
        text: 'Have you been diagnosed with sleep apnea or sleep-related breathing disorder?',
        type: 'radio',
        options: [
          { value: 'mild', label: 'Mild' },
          { value: 'moderate', label: 'Moderate' },
          { value: 'severe', label: 'Severe' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: '3.2',
        text: 'Do you snore, stop breathing, gasp or snort during sleep?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: '3.3',
        text: 'Do you have mouth breathing or dry mouth?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  },
  {
    id: 'section4',
    title: 'Restless Legs',
    questions: [
      {
        id: '4.1',
        text: 'Do you have trouble lying still when trying to sleep?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: '4.2',
        text: 'Do you have an urge to move your legs at night?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: '4.3',
        text: 'Does moving help?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: '4.4',
        text: 'Do you have leg discomfort during the day?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  },
  {
    id: 'section5',
    title: 'Parasomnias',
    questions: [
      {
        id: '5.1',
        text: 'Do you ever: (Tick all that apply)',
        type: 'checkbox',
        options: [
          { value: 'walk', label: 'Walk, talk, appear confused, upset at night' },
          { value: 'dreams', label: 'Act out dreams' },
          { value: 'wet', label: 'Wet the bed more than once a month' }
        ]
      },
      {
        id: '5.2',
        text: 'Do you remember these events?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: '5.3',
        text: 'Have you been diagnosed with a parasomnia?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  },
  {
    id: 'section6',
    title: 'Nightmares',
    questions: [
      {
        id: '6.1',
        text: 'Do you have nightmares?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        subQuestions: [
          {
            id: '6.1a',
            text: 'How many nights per week?',
            type: 'number',
            min: 0,
            max: 7,
            condition: '6.1 === "yes"'
          }
        ]
      },
      {
        id: '6.2',
        text: 'Are nightmares linked to trauma/PTSD?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  },
  {
    id: 'section7',
    title: 'Body Clock & Shift Work',
    questions: [
      {
        id: '7.1',
        text: 'Do you prefer:',
        type: 'radio',
        options: [
          { value: 'early', label: 'Bed early/wake early' },
          { value: 'late', label: 'Bed late/wake late' },
          { value: 'flexible', label: 'Flexible' }
        ]
      },
      {
        id: '7.2',
        text: 'Do you do shift work?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        subQuestions: [
          {
            id: '7.2a',
            text: 'Type of shift work:',
            type: 'text',
            placeholder: 'e.g., rotating, night shift, etc.',
            condition: '7.2 === "yes"'
          },
          {
            id: '7.2b',
            text: 'Days per week:',
            type: 'number',
            min: 1,
            max: 7,
            condition: '7.2 === "yes"'
          }
        ]
      },
      {
        id: '7.3',
        text: 'Have you done shift work before?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        subQuestions: [
          {
            id: '7.3a',
            text: 'How many years?',
            type: 'number',
            min: 0,
            max: 50,
            condition: '7.3 === "yes"'
          }
        ]
      },
      {
        id: '7.4',
        text: 'Do you cross time zones monthly?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  },
  {
    id: 'section8',
    title: 'Sleep Aids & Lifestyle',
    questions: [
      {
        id: '8.1',
        text: 'Do you use supplements or medications for sleep?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        subQuestions: [
          {
            id: '8.1a',
            text: 'Which ones?',
            type: 'text',
            placeholder: 'e.g., melatonin, prescription sleep aids, etc.',
            condition: '8.1 === "yes"'
          }
        ]
      },
      {
        id: '8.2',
        text: 'Rate your bedroom (1-10 scale):',
        type: 'scale',
        min: 1,
        max: 10,
        placeholder: 'How relaxing is your bedroom?'
      },
      {
        id: '8.3',
        text: 'Daily caffeine consumption:',
        type: 'number',
        min: 0,
        max: 20,
        placeholder: 'Number of cups/servings'
      },
      {
        id: '8.3a',
        text: 'What time is your last caffeine?',
        type: 'time',
        placeholder: '2:00 PM'
      },
      {
        id: '8.4',
        text: 'Alcohol per week:',
        type: 'number',
        min: 0,
        max: 50,
        placeholder: 'Number of drinks'
      },
      {
        id: '8.5',
        text: 'Exercise frequency:',
        type: 'number',
        min: 0,
        max: 7,
        placeholder: 'Days per week'
      },
      {
        id: '8.5a',
        text: 'How long do you exercise?',
        type: 'number',
        min: 0,
        max: 300,
        placeholder: 'Minutes per session',
        condition: '8.5 > 0'
      },
      {
        id: '8.5b',
        text: 'What time do you usually exercise?',
        type: 'time',
        placeholder: '6:00 PM',
        condition: '8.5 > 0'
      }
    ]
  }
];

export const demographicQuestions: Question[] = [
  {
    id: 'birthYear',
    text: 'What year were you born?',
    type: 'number',
    min: 1920,
    max: new Date().getFullYear(),
    required: true,
    placeholder: '1990'
  },
  {
    id: 'zipcode',
    text: 'What is your zipcode or county?',
    type: 'text',
    required: true,
    placeholder: '12345 or County Name'
  },
  {
    id: 'sex',
    text: 'What is your sex?',
    type: 'radio',
    required: true,
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
      { value: 'prefer-not-to-say', label: 'Prefer not to say' }
    ]
  }
];
