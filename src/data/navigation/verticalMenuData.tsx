// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes';

const verticalMenuData = (): VerticalMenuDataType[] => [
    {
        label: 'Home',
        href: '/portal',
        icon: 'tabler-smart-home'
    },
    {
        label: 'Categories',
        href: '/portal/categories',
        icon: 'tabler-stack',
        module: 'category',
        action: 'read'
    },
    {
        label: 'Tags',
        href: '/portal/tags',
        icon: 'tabler-tag',
        module: 'tags',
        action: 'read'
    },
    {
        label: 'Products',
        href: '/portal/products',
        icon: 'tabler-clipboard-list',
        module: 'product',
        action: 'read',
        options: [
            {
                label: 'Create',
                href: '/portal/products/create'
            }
        ]
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
                label: 'Shop Owners',
                href: '/portal/users/appusers'
            }
        ]
    },
    {
        label: 'Roles',
        href: '/portal/roles',
        icon: 'tabler-shield-chevron',
        module: 'role',
        action: 'read',
        options: [
            {
                label: 'Shop Owner Roles',
                href: '/portal/roles/user'
            },
            {
                label: 'Admin Roles',
                href: '/portal/roles/admin'
            }
        ]
    }
];

export default verticalMenuData;
