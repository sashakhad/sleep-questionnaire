import { Control, FieldValues, Path } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

interface CheckboxFieldProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  description?: string;
}

export function CheckboxField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
}: CheckboxFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='group border-border/60 bg-card/50 hover:border-primary/30 hover:bg-card data-[state=checked]:border-primary/40 data-[state=checked]:bg-primary/5 flex flex-row items-start space-y-0 space-x-3 rounded-xl border p-4 transition-all'>
          <FormControl>
            <Checkbox
              checked={!!field.value}
              onCheckedChange={field.onChange}
              className='border-muted-foreground/40 data-[state=checked]:border-primary data-[state=checked]:bg-primary mt-0.5'
            />
          </FormControl>
          <div className='space-y-1 leading-none'>
            <FormLabel className='text-foreground/90 group-hover:text-foreground cursor-pointer font-medium transition-colors'>
              {label}
            </FormLabel>
            {description && (
              <FormDescription className='text-muted-foreground/80'>{description}</FormDescription>
            )}
          </div>
        </FormItem>
      )}
    />
  );
}
