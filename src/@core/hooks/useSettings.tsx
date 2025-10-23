// React Imports
// Context Imports
import { SettingsContext } from '@core/contexts/settingsContext'
import { useContext } from 'react'

export const useSettings = () => {
  // Hooks
  const context = useContext(SettingsContext)

  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider')
  }

  return context
}
