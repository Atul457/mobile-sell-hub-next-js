import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import { IBasePagination, IReduxInitialKeyState } from '@/store/types';

import { IProductCategory } from '@/models/product-category.model';
import { ProductCategoryService } from '@/services/client/ProductCategory.service';
import { IPaginationArgs } from '@/services/types';
import { utils } from '@/utils/utils';

export interface IInitialProductCategoriesSliceState extends IReduxInitialKeyState {
    data: IBasePagination & {
        productCategories: IProductCategory[];
        status: IProductCategory['status'] | -1;
    };
}

type IProductCategoriesAction = { type: 'GET'; payload: Partial<IInitialProductCategoriesSliceState> };

type ICPaginationArgs = IPaginationArgs & {
    status: IProductCategory['status'] | -1;
};

const initialProductCategoriesState: IInitialProductCategoriesSliceState = {
    ...utils.CONST.REDUX.INITIAL_KEY_STATE,
    data: {
        ...utils.CONST.REDUX.BASE_PAGINATION,
        productCategories: [],
        status: -1
    }
};

function productCategoriesReducer(state: IInitialProductCategoriesSliceState, action: IProductCategoriesAction) {
    switch (action.type) {
        case 'GET':
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}

const useProductCategories = () => {
    const productCategoriesRef = useRef(initialProductCategoriesState);
    const [empty, setEmpty] = useState(false);
    const [productCategories, dispatch] = useReducer(productCategoriesReducer, initialProductCategoriesState);

    useEffect(() => {
        setEmpty(
            productCategories.data.page === 1 &&
                productCategories.data.productCategories.length === 0 &&
                !productCategories.data.query
        );
    }, [productCategories.data]);

    const list = useCallback(async (args: Partial<ICPaginationArgs>) => {
        try {
            const cs = new ProductCategoryService();
            const currentProductCategoriesStateData = productCategoriesRef.current.data;

            const payload = {
                page: args.page ?? currentProductCategoriesStateData.page,
                query: args.query ?? currentProductCategoriesStateData.query,
                limit: args.limit ?? currentProductCategoriesStateData.limit,
                sort: args.sort ?? currentProductCategoriesStateData.sort,
                order: args.order ?? currentProductCategoriesStateData.order,
                status: args.status ?? currentProductCategoriesStateData.status
            };

            productCategoriesRef.current = {
                ...productCategoriesRef.current,
                status: 'loading',
                data: {
                    ...productCategoriesRef.current.data,
                    ...payload
                }
            };

            dispatch({
                type: 'GET',
                payload: productCategoriesRef.current
            });

            const response = await cs.list(payload);

            productCategoriesRef.current = {
                ...productCategoriesRef.current,
                status: 'fulfilled',
                data: {
                    ...productCategories.data,
                    ...payload,
                    limit: response.data?.limit,
                    order: response.data?.order ?? payload.order,
                    sort: response.data?.sort ?? payload.sort,
                    page: response.data?.page ?? payload.page,
                    totalCount: response.data?.totalCount,
                    productCategories: response.data?.productCategories
                }
            };

            dispatch({
                type: 'GET',
                payload: productCategoriesRef.current
            });
        } catch (error) {
            productCategoriesRef.current = {
                ...productCategoriesRef.current,
                status: 'failed'
            };

            dispatch({
                type: 'GET',
                payload: productCategoriesRef.current
            });

            utils.toast.error({
                message: utils.error.getMessage(error)
            });
        }
    }, []);

    const push = (data: IProductCategory) => {
        productCategoriesRef.current = {
            ...productCategoriesRef.current,
            data: {
                ...productCategories.data,
                productCategories: [data, ...productCategoriesRef.current.data.productCategories],
                totalCount: productCategoriesRef.current.data.totalCount + 1
            }
        };
        dispatch({
            type: 'GET',
            payload: productCategoriesRef.current
        });
    };

    const update = (productCategoryId: string, data: IProductCategory) => {
        const productCategories = [...productCategoriesRef.current.data.productCategories];
        productCategories[productCategories.findIndex((r) => r._id === productCategoryId)] = data;
        productCategoriesRef.current = {
            ...productCategoriesRef.current,
            data: {
                ...productCategoriesRef.current.data,
                productCategories
            }
        };
        dispatch({
            type: 'GET',
            payload: productCategoriesRef.current
        });
    };

    const onSearch = useCallback(
        (query: string) => {
            list({
                query,
                page: 1
            });
        },
        [list]
    );

    const delete_ = (index: number) => {
        const productCategories = [...productCategoriesRef.current.data.productCategories];
        productCategories.splice(index, 1);
        productCategoriesRef.current = {
            ...productCategoriesRef.current,
            data: {
                ...productCategoriesRef.current.data,
                productCategories,
                totalCount: productCategoriesRef.current.data.totalCount + 1
            }
        };
        dispatch({
            type: 'GET',
            payload: productCategoriesRef.current
        });
    };

    return {
        empty,
        update,
        push,
        onSearch,
        productCategories,
        list,
        delete: delete_
    };
};

export default useProductCategories;
