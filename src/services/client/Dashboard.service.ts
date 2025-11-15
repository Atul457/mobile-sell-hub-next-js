import { http } from '@/utils/http';

class DashboardService {
    async get() {
        try {
            const response = await http({
                url: 'dashboard',
                method: 'GET'
            });
            return response;
        } catch (error: any) {
            throw new Error(error?.message);
        }
    }
}

export { DashboardService };
