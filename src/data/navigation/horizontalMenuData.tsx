// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
    {
        label: 'Users',
        href: '/users',
        icon: 'tabler-smart-home'
    },
    {
        label: 'About',
        href: '/about',
        icon: 'tabler-info-circle'
    }
]

export default horizontalMenuData
