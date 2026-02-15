import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ClipboardList, Info } from 'lucide-react';

interface SleepDisorderHistorySectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

const SLEEP_DISORDER_OPTIONS = [
  { value: 'insomnia', label: 'Insomnia Disorder' },
  { value: 'osa', label: 'Obstructive Sleep Apnea Syndrome' },
  { value: 'csa', label: 'Central Sleep Apnea Syndrome' },
  { value: 'rls', label: 'Restless Leg Syndrome' },
  { value: 'plmd', label: 'Periodic Limb Movement Disorder' },
  { value: 'circadian', label: 'Circadian Rhythm Disorder (Delayed or Advanced Sleep Phase)' },
  { value: 'narcolepsy', label: 'Narcolepsy' },
  { value: 'hypersomnia', label: 'Idiopathic Hypersomnia' },
  { value: 'nightmares', label: 'Nightmare Disorder' },
  { value: 'parasomnia', label: 'Parasomnia (sleepwalking or night terrors)' },
  { value: 'enuresis', label: 'Enuresis (bedwetting)' },
  { value: 'rbd', label: 'REM Behavioral Disorder' },
  { value: 'insufficient', label: 'Insufficient Sleep' },
  { value: 'none', label: 'None of the above' },
] as const;

export function SleepDisorderHistorySection({ form }: SleepDisorderHistorySectionProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div>
          <p className="text-foreground text-lg font-semibold">Sleep Disorder History</p>
          <p className="text-muted-foreground text-sm">
            Previous sleep disorder diagnoses
          </p>
        </div>
      </div>

      <Alert className="border-primary/20 bg-primary/5">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-foreground/90">
          Have you been previously diagnosed with any of the following sleep disorders? Check all
          that apply.
        </AlertDescription>
      </Alert>

      <div className="border-border bg-card/50 space-y-4 rounded-xl border p-5">
        <FormField
          control={form.control}
          name="sleepDisorderHistory.previousDiagnoses"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Sleep Disorder Diagnoses</FormLabel>
              <div className="mt-3 space-y-2">
                {SLEEP_DISORDER_OPTIONS.map((option) => (
                  <FormItem
                    key={option.value}
                    className="hover:bg-muted/50 has-[[data-state=checked]]:border-primary/20 has-[[data-state=checked]]:bg-primary/5 flex flex-row items-center space-y-0 space-x-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          const currentValue = field.value ?? [];
                          if (option.value === 'none') {
                            if (checked) {
                              field.onChange(['none']);
                            } else {
                              field.onChange(currentValue.filter((v) => v !== 'none'));
                            }
                          } else {
                            if (checked) {
                              field.onChange([
                                ...currentValue.filter((v) => v !== 'none'),
                                option.value,
                              ]);
                            } else {
                              field.onChange(currentValue.filter((v) => v !== option.value));
                            }
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-foreground/90 cursor-pointer font-normal">
                      {option.label}
                    </FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sleepDisorderHistory.otherDiagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Other</FormLabel>
              <FormControl>
                <Input
                  placeholder="Specify other diagnosis..."
                  maxLength={25}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
