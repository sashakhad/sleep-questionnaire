'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none items-center py-2 select-none', className)}
    {...props}
  >
    <SliderPrimitive.Track className='bg-primary/10 relative h-2.5 w-full grow overflow-hidden rounded-full'>
      <SliderPrimitive.Range className='from-primary to-primary/80 absolute h-full bg-gradient-to-r transition-all' />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className='border-primary bg-background ring-offset-background focus-visible:ring-ring block h-6 w-6 rounded-full border-2 shadow-md transition-all hover:scale-110 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50' />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
