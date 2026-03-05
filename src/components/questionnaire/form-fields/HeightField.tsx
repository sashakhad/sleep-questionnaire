'use client';

import { useState, useRef, useEffect } from 'react';
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
  description?: string | undefined;
}

export function HeightField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label = 'Height',
  description,
}: HeightFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({ control, name });

  const totalInches = field.value as number | null;
  const derivedFeet = (totalInches !== null && totalInches !== undefined)
    ? Math.floor(totalInches / 12)
    : null;
  const derivedInches = (totalInches !== null && totalInches !== undefined)
    ? totalInches % 12
    : null;

  const [pendingFeet, setPendingFeet] = useState<number | null>(null);
  const suppressRef = useRef(false);

  useEffect(() => {
    suppressRef.current = true;
    const id = requestAnimationFrame(() => { suppressRef.current = false; });
    return () => cancelAnimationFrame(id);
  }, [field.value]);

  const displayFeet = derivedFeet ?? pendingFeet;
  const displayInches = derivedInches;

  function handleFeetChange(newFeet: number | null) {
    if (suppressRef.current) {
      return;
    }
    if (newFeet === null) {
      field.onChange(null);
      setPendingFeet(null);
      return;
    }
    if (derivedInches !== null) {
      field.onChange(newFeet * 12 + derivedInches);
      setPendingFeet(null);
    } else {
      setPendingFeet(newFeet);
    }
  }

  function handleInchesChange(newInches: number | null) {
    if (suppressRef.current) {
      return;
    }
    const currentFeet = derivedFeet ?? pendingFeet;
    if (currentFeet !== null && newInches !== null) {
      field.onChange(currentFeet * 12 + newInches);
      setPendingFeet(null);
    }
  }

  const feetOptions = [3, 4, 5, 6, 7];
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
