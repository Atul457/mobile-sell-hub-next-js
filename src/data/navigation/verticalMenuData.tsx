// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
  {
    label: 'Home',
    href: '/portal',
    icon: 'tabler-smart-home'
  },
  {
    label: 'Categories',
    href: '/portal/categories',
    icon: 'tabler-stack'
  },
  {
    label: 'Platform Users',
    href: '/portal/users',
    icon: 'tabler-users',
    module: 'user',
    action: 'read',
    options: [
      {
        label: 'Admin Users',
        href: '/portal/users/admin'
      },
      {
        label: 'Users',
        href: '/portal/users/appusers'
      }
    ]
  },
  {
    label: 'Examinee Profiles',
    href: '/profiles',
    icon: 'tabler-user-plus',
    subUrls: ['/profiles/'],
    module: 'profile',
    action: 'read',
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: 'tabler-file-text',
    subUrls: ['/reports/'],
    module: 'report',
    action: 'read',
  },
  {
    label: 'QR Management',
    href: '/qrs',
    icon: 'tabler-qrcode',
    module: 'qr',
    action: 'read',
  },
  {
    label: 'Package Management',
    href: '/packages',
    icon: 'tabler-packages',
    module: 'package',
    action: 'read',
  },
  {
    label: 'Transactions',
    href: '/transactions',
    icon: 'tabler-currency-dollar',
    module: 'transaction',
    action: 'read',
  },
  {
    label: 'Roles',
    href: '/roles',
    icon: 'tabler-shield-chevron',
    module: 'role',
    action: 'read',
    options: [
      {
        label: 'User Roles',
        href: '/roles/user'
      },
      {
        label: ' Admin Roles',
        href: '/roles/admin'
      }
    ]
  }
]

export default verticalMenuData
