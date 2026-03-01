'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface YearComboboxFieldProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  description?: string;
  minYear?: number;
  maxYear?: number;
}

export function YearComboboxField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder = 'Select year...',
  description,
  minYear = 1920,
  maxYear = new Date().getFullYear(),
}: YearComboboxFieldProps<TFieldValues>) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Generate years in descending order (most recent first)
  const allYears = useMemo(() => {
    const result: number[] = [];
    for (let year = maxYear; year >= minYear; year--) {
      result.push(year);
    }
    return result;
  }, [minYear, maxYear]);

  // Filter years based on search - prefix matching
  const filteredYears = useMemo(() => {
    if (!searchValue) {
      return allYears;
    }
    return allYears.filter(year => year.toString().startsWith(searchValue));
  }, [allYears, searchValue]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col'>
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              setSearchValue('');
            }
          }}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={open}
                  className={cn(
                    'w-full justify-between font-normal',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value ? field.value.toString() : placeholder}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0' align='start'>
              <div className='flex flex-col'>
                <div className='flex items-center border-b px-3'>
                  <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
                  <Input
                    ref={inputRef}
                    placeholder='Type a year...'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className='h-10 border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0'
                  />
                </div>
                <div className='max-h-[300px] overflow-y-auto p-1'>
                  {filteredYears.length === 0 ? (
                    <div className='py-6 text-center text-sm text-muted-foreground'>
                      No year found.
                    </div>
                  ) : (
                    filteredYears.map(year => (
                      <button
                        key={year}
                        type='button'
                        onClick={() => {
                          field.onChange(year);
                          setOpen(false);
                          setSearchValue('');
                        }}
                        className={cn(
                          'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                          'hover:bg-accent hover:text-accent-foreground',
                          'focus:bg-accent focus:text-accent-foreground'
                        )}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            field.value === year ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {year}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
