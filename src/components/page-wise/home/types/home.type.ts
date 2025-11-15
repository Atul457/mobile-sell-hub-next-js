export type DashboardData = {
    stats: {
        key: DashboardModuleType;
        value: number;
    }[];
} | null;

export type DashboardModuleType = 'admins' | 'shops' | 'tags' | 'products' | 'categories' | 'product-categories';

export type StatsColorsMapping = {
    [K in DashboardModuleType]: [string, string, string];
};
