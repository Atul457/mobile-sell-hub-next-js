import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import { IBasePagination, IReduxInitialKeyState } from '@/store/types';

import { IProduct } from '@/models/product.model';
import { ProductService } from '@/services/client/Product.service';
import { IPaginationArgs } from '@/services/types';
import { utils } from '@/utils/utils';

export interface IInitialProductsSliceState extends IReduxInitialKeyState {
    data: IBasePagination & {
        products: IProduct[];
        status: IProduct['status'] | -1;
        categoryId: IProduct['categoryId'] | -1;
    };
}

type IProductsAction = { type: 'GET'; payload: Partial<IInitialProductsSliceState> };

type ICPaginationArgs = IPaginationArgs & {
    status: IProduct['status'] | -1;
    categoryId: IProduct['categoryId'] | -1;
};

const initialProductsState: IInitialProductsSliceState = {
    ...utils.CONST.REDUX.INITIAL_KEY_STATE,
    data: {
        ...utils.CONST.REDUX.BASE_PAGINATION,
        products: [],
        status: -1,
        categoryId: -1
    }
};

function productsReducer(state: IInitialProductsSliceState, action: IProductsAction) {
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

const useProducts = () => {
    const productsRef = useRef(initialProductsState);
    const [empty, setEmpty] = useState(false);
    const [products, dispatch] = useReducer(productsReducer, initialProductsState);

    useEffect(() => {
        setEmpty(products.data.page === 1 && products.data.products.length === 0 && !products.data.query);
    }, [products.data]);

    const list = useCallback(async (args: Partial<ICPaginationArgs>) => {
        try {
            const cs = new ProductService();
            const currentProductsStateData = productsRef.current.data;

            const payload = {
                page: args.page ?? currentProductsStateData.page,
                query: args.query ?? currentProductsStateData.query,
                limit: args.limit ?? currentProductsStateData.limit,
                sort: args.sort ?? currentProductsStateData.sort,
                order: args.order ?? currentProductsStateData.order,
                status: args.status ?? currentProductsStateData.status,
                categoryId: args.categoryId ?? currentProductsStateData.categoryId
            };

            productsRef.current = {
                ...productsRef.current,
                status: 'loading',
                data: {
                    ...productsRef.current.data,
                    ...payload
                }
            };

            dispatch({
                type: 'GET',
                payload: productsRef.current
            });

            const response = await cs.list(payload);

            productsRef.current = {
                ...productsRef.current,
                status: 'fulfilled',
                data: {
                    ...products.data,
                    ...payload,
                    limit: response.data?.limit,
                    order: response.data?.order ?? payload.order,
                    sort: response.data?.sort ?? payload.sort,
                    page: response.data?.page ?? payload.page,
                    totalCount: response.data?.totalCount,
                    products: response.data?.products
                }
            };

            dispatch({
                type: 'GET',
                payload: productsRef.current
            });
        } catch (error) {
            productsRef.current = {
                ...productsRef.current,
                status: 'failed'
            };

            dispatch({
                type: 'GET',
                payload: productsRef.current
            });

            utils.toast.error({
                message: utils.error.getMessage(error)
            });
        }
    }, []);

    const push = (data: IProduct) => {
        productsRef.current = {
            ...productsRef.current,
            data: {
                ...products.data,
                products: [data, ...productsRef.current.data.products],
                totalCount: productsRef.current.data.totalCount + 1
            }
        };
        dispatch({
            type: 'GET',
            payload: productsRef.current
        });
    };

    const update = (categoryId: string, data: IProduct) => {
        const products = [...productsRef.current.data.products];
        products[products.findIndex((r) => r._id === categoryId)] = data;
        productsRef.current = {
            ...productsRef.current,
            data: {
                ...productsRef.current.data,
                products
            }
        };
        dispatch({
            type: 'GET',
            payload: productsRef.current
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
        const products = [...productsRef.current.data.products];
        products.splice(index, 1);
        productsRef.current = {
            ...productsRef.current,
            data: {
                ...productsRef.current.data,
                products,
                totalCount: productsRef.current.data.totalCount + 1
            }
        };
        dispatch({
            type: 'GET',
            payload: productsRef.current
        });
    };

    return {
        empty,
        update,
        push,
        onSearch,
        products,
        list,
        delete: delete_
    };
};

export default useProducts;
