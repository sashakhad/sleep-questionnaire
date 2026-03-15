'use client'

import { useState, useRef, useEffect } from 'react'
import { Control, ControllerRenderProps, FieldValues, Path } from 'react-hook-form'
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
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Clock } from 'lucide-react'

interface TimeFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  description?: string
  defaultPeriod?: 'AM' | 'PM'
}

function parseTime(time: string): { hour: string; minute: string; period: 'AM' | 'PM' } | null {
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

function formatTime(hour: string, minute: string, period: 'AM' | 'PM'): string {
  let hour24 = parseInt(hour, 10)
  if (period === 'AM' && hour24 === 12) {
    hour24 = 0
  } else if (period === 'PM' && hour24 !== 12) {
    hour24 += 12
  }
  return `${hour24.toString().padStart(2, '0')}:${minute}`
}

const hours = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const minutes = ['00', '15', '30', '45']

interface TimeFieldInnerProps {
  field: ControllerRenderProps<FieldValues, string>
  defaultPeriod: 'AM' | 'PM'
  label: string
  description?: string | undefined
}

function GridButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-md border px-2 py-1.5 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        selected
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-input bg-background hover:bg-accent hover:text-accent-foreground',
      )}
    >
      {children}
    </button>
  )
}

function DesktopSelects({
  parsed,
  defaultPeriod,
  onChangeValue,
}: {
  parsed: ReturnType<typeof parseTime>
  defaultPeriod: 'AM' | 'PM'
  onChangeValue: (type: 'hour' | 'minute' | 'period', value: string) => void
}) {
  return (
    <div className="hidden md:flex items-center gap-2">
      <FormControl>
        <Select
          value={parsed?.hour ?? ''}
          onValueChange={(value) => onChangeValue('hour', value)}
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
          onValueChange={(value) => onChangeValue('minute', value)}
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
          onValueChange={(value) => onChangeValue('period', value)}
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
  )
}

function MobileGridPopover({
  parsed,
  defaultPeriod,
  onChangeValue,
}: {
  parsed: ReturnType<typeof parseTime>
  defaultPeriod: 'AM' | 'PM'
  onChangeValue: (type: 'hour' | 'minute' | 'period', value: string) => void
}) {
  const [open, setOpen] = useState(false)

  const displayValue = parsed
    ? `${parsed.hour}:${parsed.minute} ${parsed.period}`
    : null

  return (
    <div className="md:hidden">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              'flex h-10 w-full max-w-xs items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              !displayValue && 'text-muted-foreground',
            )}
          >
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            {displayValue ?? 'Select time'}
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[280px] p-3">
          <div className="space-y-3">
            <div>
              <p className="text-muted-foreground mb-1.5 text-xs font-medium">Hour</p>
              <div className="grid grid-cols-4 gap-1">
                {hours.map((h) => (
                  <GridButton
                    key={h}
                    selected={parsed?.hour === h}
                    onClick={() => onChangeValue('hour', h)}
                  >
                    {h}
                  </GridButton>
                ))}
              </div>
            </div>

            <div>
              <p className="text-muted-foreground mb-1.5 text-xs font-medium">Minute</p>
              <div className="grid grid-cols-4 gap-1">
                {minutes.map((m) => (
                  <GridButton
                    key={m}
                    selected={parsed?.minute === m}
                    onClick={() => onChangeValue('minute', m)}
                  >
                    :{m}
                  </GridButton>
                ))}
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-1">
                {(['AM', 'PM'] as const).map((p) => (
                  <GridButton
                    key={p}
                    selected={parsed?.period === p}
                    onClick={() => onChangeValue('period', p)}
                  >
                    {p}
                  </GridButton>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function TimeFieldInner({ field, defaultPeriod, label, description }: TimeFieldInnerProps) {
  const parsed = parseTime(field.value as string)
  const mountedRef = useRef(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => { mountedRef.current = true })
    return () => cancelAnimationFrame(id)
  }, [])

  function handleChange(type: 'hour' | 'minute' | 'period', value: string) {
    if (!mountedRef.current) {
      return
    }

    const hour = type === 'hour' ? value : (parsed?.hour ?? '1')
    const minute = type === 'minute' ? value : (parsed?.minute ?? '00')
    const period = type === 'period' ? value : (parsed?.period ?? defaultPeriod)

    const newTime = formatTime(hour, minute, period as 'AM' | 'PM')
    field.onChange(newTime)
  }

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <DesktopSelects parsed={parsed} defaultPeriod={defaultPeriod} onChangeValue={handleChange} />
      <MobileGridPopover parsed={parsed} defaultPeriod={defaultPeriod} onChangeValue={handleChange} />
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  )
}

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
      render={({ field }) => (
        <TimeFieldInner
          field={field as unknown as ControllerRenderProps<FieldValues, string>}
          defaultPeriod={defaultPeriod}
          label={label}
          description={description}
        />
      )}
    />
  )
}
