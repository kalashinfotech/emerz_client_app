import { format, intervalToDuration, isValid, parse, parseISO } from 'date-fns'

/**
 * Converts a date string from 'yyyy-MM-dd' to 'dd/MM/yyyy'.
 * @param {string} inputDate - The input date string in 'yyyy-MM-dd' format.
 * @param customFormat - Optional custom format string (overrides default behavior).
 * @returns {string|null} The formatted date string in 'dd/MM/yyyy', or null if input is invalid.
 */
export function formatDateToDisplay(inputDate: string, customFormat?: string): string | null {
  const parsed = parse(inputDate, 'yyyy-MM-dd', new Date())
  if (!isValid(parsed)) return null
  const defaultFormat = 'dd/MM/yyyy'
  const formatToUse = customFormat || defaultFormat
  return format(parsed, formatToUse)
}

/**
 * Converts a date string from 'dd/MM/yyyy' to 'yyyy-MM-dd' (ISO format).
 * @param dateStr - The input date string in 'dd/MM/yyyy' format.
 * @returns The formatted date string in 'yyyy-MM-dd', or null if invalid.
 */
export const convertDisplayDateToISO = (dateStr: string): string | null => {
  const parsed = parse(dateStr, 'dd/MM/yyyy', new Date())
  if (!isValid(parsed)) return null
  return format(parsed, 'yyyy-MM-dd')
}

/**
 * Converts a UTC ISO date string to a local formatted date string.
 * Shows time only if it exists in the input and `showTime` is true.
 *
 * @param utcDateString - The UTC ISO date string (e.g., '2025-05-12T14:30:00Z').
 * @param showTime - If true, includes time when available.
 * @param customFormat - Optional custom format string (overrides default behavior).
 * @returns The formatted date string or null if input is invalid.
 */
export function formatUtcStringToLocalDisplay(
  utcDateString: string,
  showTime: boolean = false,
  customFormat?: string,
): string | null {
  if (!utcDateString) return null

  const date = parseISO(utcDateString)
  if (!isValid(date)) return null

  const hasTime = utcDateString.includes('T')
  const defaultFormat = showTime && hasTime ? 'dd/MM/yyyy HH:mm:ss' : 'dd/MM/yyyy'
  const formatToUse = customFormat || defaultFormat

  return format(date, formatToUse)
}

/**
 * Computes the age in years from a birth date string or Date object.
 * Accepts either a Date, ISO string ('yyyy-MM-dd'), or display string ('dd/MM/yyyy').
 *
 * @param birthDateInput - The birth date (Date object or string).
 * @returns The age in years, or null if input is invalid or in the future.
 */
export function computeAge(birthDateInput: string | Date): number | null {
  let birthDate: Date

  if (birthDateInput instanceof Date) {
    birthDate = birthDateInput
  } else {
    // Try parsing as ISO string, fallback to 'dd/MM/yyyy' if that fails
    birthDate = parseISO(birthDateInput)
    if (!isValid(birthDate)) {
      birthDate = parse(birthDateInput, 'dd/MM/yyyy', new Date())
    }
  }

  if (!isValid(birthDate) || birthDate > new Date()) {
    return null
  }

  const { years } = intervalToDuration({ start: birthDate, end: new Date() })
  return years ?? 0
}

export function formatTimeToDisplay(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = hours % 12 || 12 // Convert 0 to 12 for 12 AM
  return `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`
}
