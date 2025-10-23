// Third-party Imports
// Type Imports
import type { ChildrenType } from '@core/types'

import 'react-perfect-scrollbar/dist/css/styles.css'
// Style Imports
import '@/app/globals.css'
import '@assets/iconify-icons/generated-icons.css'
import 'react-toastify/dist/ReactToastify.css'

import CustomProviders from '@/components/CustomProviders'
// Generated Icon CSS Imports

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME}`,
  icons: [{ url: './favicon.svg', fetchPriority: 'high' }]
}

const RootLayout = ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'

  return (
    <html id='__next' lang='en' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        {process.env.NEXT_PUBLIC_ENVIRONMENT === 'local' ? <section className='overlay'></section> : null}
        <CustomProviders>{children}</CustomProviders>
      </body>
    </html>
  )
}

export default RootLayout
