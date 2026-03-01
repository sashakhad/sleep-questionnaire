'use client'

import { Control, FieldValues, Path } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TimeFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  description?: string
  defaultPeriod?: 'AM' | 'PM'
}

// Convert 24-hour time string (HH:MM) to 12-hour format parts
function parseTime(time: string): { hour: string; minute: string; period: string } | null {
  if (!time) {
    return null
  }
  const [h, m] = time.split(':').map(Number)
  const hour24 = h ?? 0
  const minute = m ?? 0
  
  let hour12 = hour24 % 12
  if (hour12 === 0) {
    hour12 = 12
  }
  const period: 'AM' | 'PM' = hour24 < 12 ? 'AM' : 'PM'
  
  return {
    hour: hour12.toString(),
    minute: minute.toString().padStart(2, '0'),
    period,
  }
}

// Convert 12-hour format parts to 24-hour time string (HH:MM)
function formatTime(hour: string, minute: string, period: 'AM' | 'PM'): string {
  let hour24 = parseInt(hour, 10)
  if (period === 'AM' && hour24 === 12) {
    hour24 = 0
  } else if (period === 'PM' && hour24 !== 12) {
    hour24 += 12
  }
  return `${hour24.toString().padStart(2, '0')}:${minute}`
}

const hours = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
const minutes = ['00', '15', '30', '45']

export function TimeField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  defaultPeriod = 'PM',
}: TimeFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const parsed = parseTime(field.value as string)
        
        const handleChange = (
          type: 'hour' | 'minute' | 'period',
          value: string
        ) => {
          const hour = type === 'hour' ? value : (parsed?.hour ?? '12')
          const minute = type === 'minute' ? value : (parsed?.minute ?? '00')
          const period = type === 'period' ? value : (parsed?.period ?? defaultPeriod)
          
          const newTime = formatTime(hour, minute, period as 'AM' | 'PM')
          field.onChange(newTime)
        }
        
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="flex items-center gap-2">
              <FormControl>
                <Select
                  value={parsed?.hour ?? ''}
                  onValueChange={(value) => handleChange('hour', value)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <span className="text-muted-foreground">:</span>
              <FormControl>
                <Select
                  value={parsed?.minute ?? ''}
                  onValueChange={(value) => handleChange('minute', value)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormControl>
                <Select
                  value={parsed?.period ?? ''}
                  onValueChange={(value) => handleChange('period', value)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder={defaultPeriod} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </div>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
