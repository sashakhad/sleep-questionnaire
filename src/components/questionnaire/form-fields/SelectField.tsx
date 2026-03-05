'use client';

import { useRef, useEffect } from 'react';
import { Control, ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
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

interface SelectFieldProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string | undefined;
  description?: string | undefined;
  options: { value: string; label: string }[];
}

interface SelectFieldInnerProps {
  field: ControllerRenderProps<FieldValues, string>;
  placeholder: string;
  description?: string | undefined;
  label: string;
  options: { value: string; label: string }[];
}

function SelectFieldInner({ field, placeholder, description, label, options }: SelectFieldInnerProps) {
  const mountedRef = useRef(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => { mountedRef.current = true; });
    return () => cancelAnimationFrame(id);
  }, []);

  function handleValueChange(value: string) {
    if (!mountedRef.current) {
      return;
    }
    field.onChange(value === '' ? null : value);
  }

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Select
        onValueChange={handleValueChange}
        value={field.value ?? ''}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}

export function SelectField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder = 'Select an option',
  description,
  options,
}: SelectFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <SelectFieldInner
          field={field as unknown as ControllerRenderProps<FieldValues, string>}
          placeholder={placeholder}
          description={description}
          label={label}
          options={options}
        />
      )}
    />
  );
}
