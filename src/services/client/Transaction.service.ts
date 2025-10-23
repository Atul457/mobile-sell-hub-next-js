import { http } from '@/utils/http'
import { object } from '@/utils/object'

import { IPaginationArgs } from '../types'

class TransactionService {
    async list(args: IPaginationArgs) {
        try {
            const response = await http({
                url: `transactions?${object.objectToUrlParams(args)}`,
                method: 'GET'
            })
            return response
        } catch (error: any) {
            throw new Error(error?.message)
        }
    }
}
export { TransactionService }
