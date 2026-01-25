import { useEffect } from 'react'

import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/context/theme-context'

import { Button } from '../ui/button'
import { Kbd } from '../ui/kbd'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // Keyboard shortcut: D
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === 'd' &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault()
        toggleTheme()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [theme])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline" className="rounded-full" onClick={toggleTheme}>
            {theme === 'dark' ? <Moon /> : <Sun />}
          </Button>
        </TooltipTrigger>

        <TooltipContent side="bottom" className="flex items-center gap-2">
          <span>Toggle theme</span>
          <Kbd>D</Kbd>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
