import type { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const unprotectedRoutes = ['/portal/login', '/register']
const protectedRoutes = [
  '/portal',
  '/portal/users',
  '/portal/profiles',
  '/portal/qrs',
  '/portal/reports',
  '/portal/transactions',
  '/portal/packages',
  '/portal/categories'
]

export async function middleware(req: NextApiRequest) {
  let redirect = false
  const data = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET })
  const isLoggedInUser = !!data && Object.keys(data).length > 0
  const baseUrl = process.env.NEXT_PUBLIC_APP_HOSTNAME
  const authRedirectUrl = `${baseUrl}/portal/login`

  const pathname = decodeURIComponent((req as any)?.nextUrl?.pathname)
  const requestHeaders = new Headers((req as any).headers)
  requestHeaders.set('x-pathname', pathname)
  requestHeaders.set('x-game', pathname)

  const routeType = (routes: string[]) => routes.find(route => pathname === route) ?? null

  const unprotectedUrl = routeType(unprotectedRoutes)
  const protectedUrl = routeType(protectedRoutes)

  let redirectUrl = isLoggedInUser ? baseUrl : authRedirectUrl

  if (unprotectedUrl || protectedUrl) {
    if (isLoggedInUser) {
      if (unprotectedUrl) {
        redirect = true
        redirectUrl = baseUrl
        console.debug('Redirecting to dashboard from unprotected url')
      }
    } else if (protectedUrl) {
      redirect = true
      redirectUrl = authRedirectUrl
      console.debug('Redirecting to auth login URL')
    }

    if (redirect) {
      console.debug(`\n\nRequested URL: ${pathname} `)
      console.debug(`Redirected to: ${redirectUrl} `)
      return NextResponse.redirect(redirectUrl!)
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}
