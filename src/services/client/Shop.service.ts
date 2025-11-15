import { http } from '@/utils/http';

class ShopService {
    async register(data: Record<any, any>) {
        try {
            const response = await http({
                url: 'shop-register',
                data,
                method: 'POST'
            });
            return response;
        } catch (error: any) {
            throw new Error(error?.message);
        }
    }

    async update(data: Record<any, any>) {
        try {
            const response = await http({
                url: 'branding',
                data,
                method: 'PATCH'
            });
            return response;
        } catch (error: any) {
            throw new Error(error?.message);
        }
    }

    async get() {
        try {
            const response = await http({
                url: 'branding',
                method: 'GET'
            });
            return response;
        } catch (error: any) {
            throw new Error(error?.message);
        }
    }
}

export { ShopService };
