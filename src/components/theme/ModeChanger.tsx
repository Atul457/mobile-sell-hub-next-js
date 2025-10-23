// React Imports
// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
// MUI Imports
import { useColorScheme } from '@mui/material/styles'
import { useEffect } from 'react'
// Third-party Imports
import { useMedia } from 'react-use'

const ModeChanger = () => {
  // Hooks
  const { setMode } = useColorScheme()
  const { settings } = useSettings()
  const isDark = useMedia('(prefers-color-scheme: dark)', false)

  useEffect(() => {
    if (settings.mode) {
      if (settings.mode === 'system') {
        setMode(isDark ? 'dark' : 'light')
      } else {
        setMode(settings.mode)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.mode])

  return null
}

export default ModeChanger
