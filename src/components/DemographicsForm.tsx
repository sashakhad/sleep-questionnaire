'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const demographicsSchema = z.object({
  birthYear: z.number().min(1900, 'Please enter a valid birth year').max(2024, 'Please enter a valid birth year'),
  zipcode: z.string().min(1, 'Zipcode is required'),
  sex: z.string().min(1, 'Please select your sex'),
});

type DemographicsData = z.infer<typeof demographicsSchema>;

interface DemographicsFormProps {
  onNext: (data: DemographicsData) => void;
  onPrevious?: () => void;
  isFirst?: boolean;
}

export function DemographicsForm({ onNext, onPrevious, isFirst = true }: DemographicsFormProps) {
  const form = useForm<DemographicsData>({
    resolver: zodResolver(demographicsSchema),
    defaultValues: {
      zipcode: '',
      sex: '',
    },
    mode: 'onChange'
  });

  function onSubmit(values: DemographicsData) {
    onNext(values);
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Basic Information</CardTitle>
        <CardDescription>
          Please answer the following questions about your sleep patterns.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="birthYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">What year were you born?</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1990"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : '')}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">What is your zipcode or county?</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="12345 or County Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-medium">What is your sex?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="sex-male" />
                        <Label htmlFor="sex-male" className="text-sm font-normal cursor-pointer">
                          Male
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="sex-female" />
                        <Label htmlFor="sex-female" className="text-sm font-normal cursor-pointer">
                          Female
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="sex-other" />
                        <Label htmlFor="sex-other" className="text-sm font-normal cursor-pointer">
                          Other
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="prefer-not-to-say" id="sex-prefer-not" />
                        <Label htmlFor="sex-prefer-not" className="text-sm font-normal cursor-pointer">
                          Prefer not to say
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between pt-6">
              {!isFirst && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onPrevious}
                >
                  Previous
                </Button>
              )}
              <Button
                type="submit"
                className={isFirst ? "ml-auto" : ""}
                disabled={!form.formState.isValid}
              >
                Next
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
