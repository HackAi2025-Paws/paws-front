/**
 * Utility functions for handling dates consistently across the application
 */

/**
 * Safely formats a date string to local date format ignoring time and timezone
 * @param dateString - The date string (e.g., "2024-01-15" or "2024-01-15T10:30:00Z")
 * @param options - Intl.DateTimeFormatOptions for formatting
 * @returns Formatted date string
 */
export function formatDateSafe(
  dateString: string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }
): string {
  if (!dateString) return 'No especificado'

  try {
    // Extract just the date part (YYYY-MM-DD) regardless of time/timezone
    let datePart = dateString

    // If it includes time (T) or timezone info, extract just the date part
    if (dateString.includes('T')) {
      datePart = dateString.split('T')[0]
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return dateString // return original if not recognizable format
    }

    // Always treat as local date, ignoring any time/timezone info
    const [year, month, day] = datePart.split('-').map(Number)
    const date = new Date(year, month - 1, day) // month is 0-indexed

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString
    }

    return date.toLocaleDateString('es-ES', options)
  } catch (error) {
    console.error('Error formatting date:', dateString, error)
    return dateString || 'Fecha inválida'
  }
}

/**
 * Formats a date for input[type="date"] fields
 * @param dateString - The date string
 * @returns YYYY-MM-DD format string
 */
export function formatDateForInput(dateString: string | null | undefined): string {
  if (!dateString) return ''

  try {
    // If it's already in YYYY-MM-DD format, return as-is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString
    }

    // Parse the date and format for input
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return ''
    }

    return date.toISOString().split('T')[0]
  } catch (error) {
    console.error('Error formatting date for input:', dateString, error)
    return ''
  }
}

/**
 * Gets today's date in YYYY-MM-DD format for input fields
 * @returns Today's date in YYYY-MM-DD format
 */
export function getTodayForInput(): string {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

/**
 * Converts a local date input value to ISO string for API
 * @param dateInputValue - Date value from input[type="date"]
 * @returns ISO string for API
 */
export function dateInputToISO(dateInputValue: string): string {
  if (!dateInputValue) return ''

  try {
    // dateInputValue is already in YYYY-MM-DD format
    // Create date at noon local time to avoid timezone issues
    const [year, month, day] = dateInputValue.split('-').map(Number)
    const date = new Date(year, month - 1, day, 12, 0, 0) // noon local time
    return date.toISOString()
  } catch (error) {
    console.error('Error converting date input to ISO:', dateInputValue, error)
    return ''
  }
}