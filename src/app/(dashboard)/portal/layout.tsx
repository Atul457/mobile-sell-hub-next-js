import { ChildrenType } from '@/@core/types'

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} - Admin`
}

const Layout = async ({ children }: ChildrenType) => {
  return children
}

export default Layout
