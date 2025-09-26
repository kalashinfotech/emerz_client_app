import React, { useEffect, useRef, useState } from 'react'

import { format, isValid, parse, parseISO } from 'date-fns'
import { Calendar as CalendarIcon, X as XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type DatePickerInputProps = {
  id?: string
  value?: Date | string | null
  onChange: (date: Date | null) => void
  placeholder?: string
  className?: string
  minDate?: Date
  maxDate?: Date
}

/** Format typing digits into dd/MM/yyyy while typing (slashes after 2nd and 4th digit) */
function formatTyping(digits: string) {
  const d = digits.slice(0, 2)
  const m = digits.slice(2, 4)
  const y = digits.slice(4, 8)
  if (!m) return d
  if (!y) return `${d}/${m}`
  return `${d}/${m}/${y}`
}

/**
 * Try parsing a flexible variety of inputs into a Date or null.
 * Accepts:
 * - ISO strings (parseISO)
 * - digit-only ddmmyyyy
 * - dd/MM/yyyy, d/M/yyyy
 * - dd-MM-yyyy, d-M-yyyy
 * - dd MM yyyy, etc.
 */
function parseFlexibleDate(text: string): Date | null {
  const trimmed = (text ?? '').trim()
  if (!trimmed) return null

  // 1) Try parseISO for ISO strings (fast/common)
  try {
    const iso = parseISO(trimmed)
    if (isValid(iso)) return iso
  } catch {
    // ignore
  }

  // 2) digits-only 8-length -> ddMMyyyy
  const digitsOnly = trimmed.replace(/\D/g, '')
  if (digitsOnly.length === 8) {
    const byDigits = parse(digitsOnly, 'ddMMyyyy', new Date())
    if (isValid(byDigits)) return byDigits
  }

  // 3) Normalize separators to '/'
  const normalized = trimmed.replace(/[-\s]+/g, '/')

  // Patterns to try (day-first)
  const patterns = ['dd/MM/yyyy', 'd/M/yyyy', 'dd/MM/yy']
  for (const p of patterns) {
    try {
      const parsed = parse(normalized, p, new Date())
      if (isValid(parsed)) return parsed
    } catch {
      // ignore
    }
  }

  return null
}

/** Coerce value (Date|string|null|undefined) to Date|null safely */
function toDateOrNull(value?: Date | string | null): Date | null {
  if (value == null) return null
  if (value instanceof Date) return isValid(value) ? value : null
  // assume string: try parseISO then flexible parsing
  const iso = parseISO(String(value))
  if (isValid(iso)) return iso
  return parseFlexibleDate(String(value))
}

/** Safe format helper */
function safeFormat(d?: Date | null): string {
  if (!d) return ''
  if (!isValid(d)) return ''
  return format(d, 'dd/MM/yyyy')
}

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = 'dd/MM/yyyy',
  className = '',
  minDate,
  maxDate,
}: DatePickerInputProps) {
  // internal coerced selected date (not strictly necessary but convenient)
  const initialDate = toDateOrNull(value)
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState<string>(() => safeFormat(initialDate))
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Keep in sync when external value prop changes (coerce string->date)
  useEffect(() => {
    const coerced = toDateOrNull(value)
    setInputValue(safeFormat(coerced))
    setError(null)
  }, [value])

  // helper to set caret
  const setCaretPos = (pos: number) => {
    const el = inputRef.current
    if (!el) return
    try {
      el.setSelectionRange(pos, pos)
    } catch {
      // ignore
    }
  }

  /** Input change handler with caret-aware formatting */
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const el = e.target
    const raw = el.value
    const prevCaret = el.selectionStart ?? raw.length

    // extract digits only (max 8)
    const digits = raw.replace(/\D/g, '').slice(0, 8)
    const formatted = formatTyping(digits)

    // Count digits to left of caret in raw string
    let digitsBeforeCaret = 0
    for (let i = 0; i < Math.min(prevCaret, raw.length); i++) {
      if (/\d/.test(raw[i])) digitsBeforeCaret++
    }

    // Map digitsBeforeCaret to new caret position in formatted string
    let newCaret = 0
    if (digitsBeforeCaret === 0) {
      newCaret = 0
    } else {
      let dCount = 0
      newCaret = 0
      for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) dCount++
        newCaret = i + 1
        if (dCount >= digitsBeforeCaret) break
      }
    }

    setInputValue(formatted)
    setError(null)

    // restore caret next frame
    window.requestAnimationFrame(() => setCaretPos(Math.min(newCaret, formatted.length)))
  }

  /** Commit input on blur/enter: parse and notify parent */
  function commitInput() {
    if (inputValue.trim() === '') {
      setError(null)
      onChange(null)
      return
    }

    const parsed = parseFlexibleDate(inputValue)
    if (!parsed) {
      setError('Invalid date (use dd/MM/yyyy)')
      return
    }
    if (minDate && parsed < minDate) {
      setError(`Date must be on/after ${format(minDate, 'dd/MM/yyyy')}`)
      return
    }
    if (maxDate && parsed > maxDate) {
      setError(`Date must be on/before ${format(maxDate, 'dd/MM/yyyy')}`)
      return
    }

    setError(null)
    onChange(new Date(parsed))
    setInputValue(format(parsed, 'dd/MM/yyyy'))
    setOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      commitInput()
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  // Calendar selection handler
  function handleCalendarSelect(date: Date | undefined) {
    if (!date) return
    if (minDate && date < minDate) return
    if (maxDate && date > maxDate) return
    onChange(new Date(date))
    setInputValue(format(date, 'dd/MM/yyyy'))
    setError(null)
    setOpen(false)
  }

  function clear() {
    setInputValue('')
    setError(null)
    onChange(null)
    inputRef.current?.focus()
  }

  // calendarSelected for Calendar component (expects Date|undefined)
  const calendarSelected = (() => {
    const d = toDateOrNull(value)
    return d && isValid(d) ? d : undefined
  })()

  return (
    <div className={`relative flex flex-col gap-1 ${className}`}>
      <div className="relative flex items-center">
        <Input
          id={id}
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={() => commitInput()}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? 'date-input-error' : undefined}
          style={{ paddingRight: 96 }} // make room for adornments
        />

        <div className="absolute right-1 flex items-center gap-1">
          {inputValue ? (
            <Button variant="ghost" size="sm" onClick={clear} aria-label="Clear date" className="h-8 w-8 p-1">
              <XIcon className="h-3 w-3" />
            </Button>
          ) : null}

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle calendar"
                className="h-8 w-8 p-1 hover:bg-transparent"
                onClick={() => {
                  setOpen((v) => !v)
                }}>
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>

            <PopoverContent align="start" side="bottom" className="w-auto p-0">
              <div className="p-2">
                <Calendar
                  mode="single"
                  selected={calendarSelected}
                  onSelect={handleCalendarSelect}
                  captionLayout="dropdown"
                  defaultMonth={calendarSelected ?? new Date()}
                  startMonth={minDate}
                  endMonth={maxDate}
                  className="rounded-md border"
                  classNames={{ month_caption: 'mx-0' }}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {error ? (
        <p id="date-input-error" className="text-destructive text-xs">
          {error}
        </p>
      ) : null}
    </div>
  )
}
