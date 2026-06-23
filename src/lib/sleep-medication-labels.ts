import type { QuestionnaireFormData } from '@/validations/questionnaire';

export const supplementOptions = [
  { value: 'melatonin', label: 'Melatonin' },
  { value: 'benadryl', label: 'Benadryl (diphenhydramine)' },
  { value: 'tylenol_pm', label: 'Tylenol PM / Advil PM' },
  { value: 'nyquil', label: 'NyQuil' },
  { value: 'unisom', label: 'Unisom (doxylamine succinate)' },
  { value: 'magnesium', label: 'Magnesium' },
  { value: 'l_theanine', label: 'L-theanine' },
  { value: 'valerian', label: 'Valerian root' },
  { value: 'cbd', label: 'CBD' },
];

export const prescriptionMedOptions = [
  { value: 'benzos', label: 'Benzodiazepines (ProSom, Dalmane, Restoril, Halcion)' },
  { value: 'z_drugs', label: 'Z-drugs (Ambien/zolpidem, Lunesta/eszopiclone, Sonata/zaleplon)' },
  { value: 'orexin', label: 'Orexin blockers (Quviviq, Dayvigo, Belsomra)' },
  {
    value: 'antidepressants',
    label: 'Sedating antidepressants (Trazodone, Mirtazapine, Doxepin, Amitriptyline)',
  },
  { value: 'melatonin_agonist', label: 'Melatonin agonists (Rozerem/Ramelteon)' },
  { value: 'antipsychotic', label: 'Antipsychotic (Seroquel, Zyprexa, Risperdal)' },
];

function getOptionLabel(options: { value: string; label: string }[], value: string): string {
  return options.find(option => option.value === value)?.label ?? value;
}

export function getSelectedSleepMedicationLabels(data: QuestionnaireFormData): string[] {
  const labels: string[] = [];

  for (const supplement of data.sleepHygiene.supplements) {
    labels.push(getOptionLabel(supplementOptions, supplement));
  }

  if (data.sleepHygiene.supplementsOther.trim().length > 0) {
    labels.push(data.sleepHygiene.supplementsOther.trim());
  }

  for (const medication of data.sleepHygiene.prescriptionMeds) {
    labels.push(getOptionLabel(prescriptionMedOptions, medication));
  }

  if (data.sleepHygiene.prescriptionMedsOther.trim().length > 0) {
    labels.push(data.sleepHygiene.prescriptionMedsOther.trim());
  }

  return labels;
}
