import { useEffect, useState } from 'react'

export function useDebouncedSearch<T>(input: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(input)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(input)
    }, delay)

    return () => clearTimeout(handler)
  }, [input, delay])

  return debouncedValue
}
