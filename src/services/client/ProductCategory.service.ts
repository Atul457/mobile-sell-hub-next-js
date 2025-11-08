import { http } from '@/utils/http';
import { object } from '@/utils/object';

import { IPaginationArgs } from '../types';

class ProductCategoryService {
    async list(args: IPaginationArgs) {
        try {
            const response = await http({
                url: `product-categories?${object.objectToUrlParams(args)}`,
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
                url: `product-categories/${id}`,
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
                url: 'product-categories',
                data,
                method: 'POST'
            });
            return response;
        } catch (error: any) {
            throw new Error(error?.message);
        }
    }
}

export { ProductCategoryService };
