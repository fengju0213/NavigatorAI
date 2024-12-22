import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export const useThemeToggle = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (mounted) {
      setTheme(theme === 'light' ? 'dark' : 'light')
    }
  }

  return { theme: mounted ? theme : undefined, toggleTheme }
}

