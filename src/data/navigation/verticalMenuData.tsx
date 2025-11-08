// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes';

const verticalMenuData = (): VerticalMenuDataType[] => [
    {
        label: 'Home',
        href: '/portal',
        icon: 'tabler-smart-home'
    },
    {
        label: 'Tags',
        href: '/portal/tags',
        icon: 'tabler-tag',
        module: ['category', 'tags'],
        options: [
            {
                label: 'Categories',
                href: '/portal/categories',
                module: 'category',
                action: 'read'
            },
            {
                label: 'List',
                href: '/portal/tags',
                module: 'tags',
                action: 'read'
            }
        ]
    },
    {
        label: 'Products',
        href: '/portal/products',
        icon: 'tabler-clipboard-list',
        action: 'read',
        module: ['product-category', 'product'],
        options: [
            {
                label: 'Categories',
                href: '/portal/product-categories',
                module: 'product-category',
                action: 'read'
            },
            {
                label: 'List',
                href: '/portal/products',
                module: 'product',
                action: 'read'
            },
            {
                label: 'Create',
                href: '/portal/products/create',
                module: 'product',
                action: 'create'
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
    },
    {
        label: 'Branding',
        href: '/portal/branding',
        icon: 'tabler-brand-google-fit',
        module: 'branding',
        action: 'read'
    }
];

export default verticalMenuData;
