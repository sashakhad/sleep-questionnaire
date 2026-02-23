'use client';

import { useState } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import {
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HeightFieldProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
}

export function HeightField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label = 'Height',
  description,
}: HeightFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({ control, name });

  // Derive feet/inches directly from the form value (single source of truth).
  // Local "partial" state is only used when the user has picked feet but not
  // yet picked inches, so we can show the feet selection without writing a
  // partial value back to the form.
  const totalInches = field.value as number | null;
  const derivedFeet = (totalInches !== null && totalInches !== undefined)
    ? Math.floor(totalInches / 12)
    : null;
  const derivedInches = (totalInches !== null && totalInches !== undefined)
    ? totalInches % 12
    : null;

  // Track a partial feet selection that hasn't been committed to the form yet
  const [pendingFeet, setPendingFeet] = useState<number | null>(null);

  // The displayed feet value: use form-derived when available, else pending
  const displayFeet = derivedFeet ?? pendingFeet;
  const displayInches = derivedInches;

  function handleFeetChange(newFeet: number | null) {
    if (newFeet !== null) {
      // If inches are already selected, update the form immediately
      const currentInches = derivedInches ?? 0;
      field.onChange(newFeet * 12 + currentInches);
      setPendingFeet(null);
    } else {
      field.onChange(null);
      setPendingFeet(null);
    }
  }

  function handleInchesChange(newInches: number | null) {
    const currentFeet = derivedFeet ?? pendingFeet;
    if (currentFeet !== null && newInches !== null) {
      field.onChange(currentFeet * 12 + newInches);
      setPendingFeet(null);
    }
  }

  // Generate options for feet (3-7 feet covers most adults)
  const feetOptions = [3, 4, 5, 6, 7];
  // Generate options for inches (0-11)
  const inchesOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className='flex gap-2'>
        <Select
          value={displayFeet?.toString() ?? ''}
          onValueChange={(value) => handleFeetChange(value ? parseInt(value, 10) : null)}
        >
          <SelectTrigger className='w-24'>
            <SelectValue placeholder='Feet' />
          </SelectTrigger>
          <SelectContent>
            {feetOptions.map((ft) => (
              <SelectItem key={ft} value={ft.toString()}>
                {ft} ft
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={displayInches?.toString() ?? ''}
          onValueChange={(value) => handleInchesChange(value ? parseInt(value, 10) : null)}
        >
          <SelectTrigger className='w-24'>
            <SelectValue placeholder='Inches' />
          </SelectTrigger>
          <SelectContent>
            {inchesOptions.map((inch) => (
              <SelectItem key={inch} value={inch.toString()}>
                {inch} in
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {description && <FormDescription>{description}</FormDescription>}
      {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
    </FormItem>
  );
}
