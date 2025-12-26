import { Control, FieldValues, Path } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface NumberFieldProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label: string
  placeholder?: string
  description?: string
  min?: number
  max?: number
  step?: number
  /** If true, empty inputs will be set to null instead of 0 */
  allowNull?: boolean
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
  allowNull = false
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
              type="number"
              placeholder={placeholder}
              {...field}
              value={field.value ?? ''}
              onChange={(e) => {
                const value = e.target.valueAsNumber;
                if (Number.isNaN(value)) {
                  // Empty input - use null if allowed, otherwise 0
                  field.onChange(allowNull ? null : 0);
                } else {
                  field.onChange(value);
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
  )
}
