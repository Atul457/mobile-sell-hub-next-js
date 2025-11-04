import { http } from '@/utils/http';
import { object } from '@/utils/object';

import { IPaginationArgs } from '../types';

class ProductService {
    async list(args: IPaginationArgs) {
        try {
            const response = await http({
                url: `products?${object.objectToUrlParams(args)}`,
                method: 'GET'
            });
            return response;
        } catch (error: any) {
            throw new Error(error?.message);
        }
    }

    async update(id: string, data: Record<any, any>) {
        try {
            const response = await http({
                url: `products/${id}`,
                data,
                method: 'PATCH'
            });
            return response;
        } catch (error: any) {
            throw new Error(error?.message);
        }
    }

    async create(data: Record<any, any>) {
        try {
            const response = await http({
                url: 'products',
                data,
                method: 'POST'
            });
            return response;
        } catch (error: any) {
            throw new Error(error?.message);
        }
    }

    async get(id: string) {
        try {
            const response = await http({
                url: `products/${id}`,
                method: 'GET'
            });
            return response;
        } catch (error: any) {
            throw new Error(error?.message);
        }
    }

    async delete(id: string) {
        try {
            const response = await http({
                url: `products/${id}`,
                method: 'DELETE'
            });
            return response;
        } catch (error: any) {
            throw new Error(error?.message);
        }
    }
}

export { ProductService };
