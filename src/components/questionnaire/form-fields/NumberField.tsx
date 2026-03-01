import { Control, FieldValues, Path } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface NumberFieldProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  min,
  max,
  step = 1,
}: NumberFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type='number'
              placeholder={placeholder}
              {...field}
              value={field.value === null || field.value === undefined ? '' : field.value}
              onChange={e => {
                const rawValue = e.target.value;
                // Allow empty input - store as null
                if (rawValue === '') {
                  field.onChange(null);
                } else {
                  const numValue = parseFloat(rawValue);
                  field.onChange(Number.isNaN(numValue) ? null : numValue);
                }
              }}
              min={min}
              max={max}
              step={step}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
