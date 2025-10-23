// Type Imports
import ThemeProvider from '@components/theme'
import { SettingsProvider } from '@core/contexts/settingsContext'
import type { ChildrenType, Direction } from '@core/types'
// Util Imports
import { getDemoName, getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'
// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'

import ToastProvider from '@/contexts/ToastProvider'

import ModalLayout from './layout/ModalLayout'

type Props = ChildrenType & {
  direction: Direction
}

const Providers = (props: Props) => {
  // Props
  const { children, direction } = props

  // Vars
  const mode = getMode()
  const settingsCookie = getSettingsFromCookie()
  const demoName = getDemoName()
  const systemMode = getSystemMode()

  return (
    <VerticalNavProvider>
      <SettingsProvider settingsCookie={settingsCookie} mode={mode} demoName={demoName}>
        <ThemeProvider direction={direction} systemMode={systemMode}>
          {children}
          <ModalLayout />
          <ToastProvider />
        </ThemeProvider>
      </SettingsProvider>
    </VerticalNavProvider>
  )
}

export default Providers
