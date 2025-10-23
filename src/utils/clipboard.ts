import { dom } from './dom'

const copy = async (text: string): Promise<boolean> => {
  if (!dom.isWindowPresent() || (dom.isWindowPresent() && !navigator.clipboard)) {
    console.error('Clipboard API is not available')
    return false
  }

  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy text to clipboard: ', error)
    return false
  }
}

const clipboard = {
  copy
}

export { clipboard }
