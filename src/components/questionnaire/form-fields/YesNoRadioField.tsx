import { Control, FieldValues, Path } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface YesNoRadioFieldProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  description?: string;
  yesLabel?: string;
  noLabel?: string;
}

export function YesNoRadioField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  yesLabel = 'Yes',
  noLabel = 'No',
}: YesNoRadioFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='space-y-3'>
          <div>
            <FormLabel className='text-base font-medium'>{label}</FormLabel>
            {description && (
              <FormDescription className='text-muted-foreground/80 mt-1'>
                {description}
              </FormDescription>
            )}
          </div>
          <FormControl>
            <RadioGroup
              onValueChange={value => field.onChange(value === 'true')}
              value={field.value === true ? 'true' : field.value === false ? 'false' : null}
              className='flex flex-col space-y-2'
            >
              <FormItem className='hover:bg-muted/50 has-[[data-state=checked]]:border-primary/30 has-[[data-state=checked]]:bg-primary/5 flex items-center space-y-0 space-x-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors'>
                <FormControl>
                  <RadioGroupItem value='true' />
                </FormControl>
                <FormLabel className='text-foreground/90 cursor-pointer font-normal'>
                  {yesLabel}
                </FormLabel>
              </FormItem>
              <FormItem className='hover:bg-muted/50 has-[[data-state=checked]]:border-primary/30 has-[[data-state=checked]]:bg-primary/5 flex items-center space-y-0 space-x-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors'>
                <FormControl>
                  <RadioGroupItem value='false' />
                </FormControl>
                <FormLabel className='text-foreground/90 cursor-pointer font-normal'>
                  {noLabel}
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
