'use client';

import { useEffect, useState } from 'react';
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

  // Convert total inches to feet/inches for display
  const totalInches = field.value as number | null;
  const initialFeet = totalInches ? Math.floor(totalInches / 12) : null;
  const initialInches = totalInches ? totalInches % 12 : null;

  const [feet, setFeet] = useState<number | null>(initialFeet);
  const [inches, setInches] = useState<number | null>(initialInches);

  // Update form value when feet or inches change
  useEffect(() => {
    if (feet !== null && inches !== null) {
      const total = feet * 12 + inches;
      field.onChange(total);
    } else if (feet !== null && inches === null) {
      // If only feet is selected, use 0 inches
      field.onChange(feet * 12);
    } else {
      field.onChange(null);
    }
  }, [feet, inches, field]);

  // Sync from form to local state when form value changes externally
  useEffect(() => {
    if (totalInches !== null && totalInches !== undefined) {
      const newFeet = Math.floor(totalInches / 12);
      const newInches = totalInches % 12;
      if (newFeet !== feet) setFeet(newFeet);
      if (newInches !== inches) setInches(newInches);
    }
  }, [totalInches]);

  // Generate options for feet (3-7 feet covers most adults)
  const feetOptions = [3, 4, 5, 6, 7];
  // Generate options for inches (0-11)
  const inchesOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className='flex gap-2'>
        <Select
          value={feet?.toString() ?? ''}
          onValueChange={(value) => setFeet(value ? parseInt(value, 10) : null)}
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
          value={inches?.toString() ?? ''}
          onValueChange={(value) => setInches(value ? parseInt(value, 10) : null)}
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
