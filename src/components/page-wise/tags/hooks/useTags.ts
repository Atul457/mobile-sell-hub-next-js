import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import { IBasePagination, IReduxInitialKeyState } from '@/store/types';

import { ITagPopulated } from '@/models/tag.model';
import { TagService } from '@/services/client/Tag.service';
import { IPaginationArgs } from '@/services/types';
import { utils } from '@/utils/utils';

export interface IInitialTagsSliceState extends IReduxInitialKeyState {
    data: IBasePagination & {
        tags: ITagPopulated[];
        status: ITagPopulated['status'] | -1;
        categoryId: ITagPopulated['categoryId'] | -1;
    };
}

type ITagsAction = { type: 'GET'; payload: Partial<IInitialTagsSliceState> };

type ICPaginationArgs = IPaginationArgs & {
    status: ITagPopulated['status'] | -1;
    categoryId: ITagPopulated['categoryId'] | -1;
};

const initialTagsState: IInitialTagsSliceState = {
    ...utils.CONST.REDUX.INITIAL_KEY_STATE,
    data: {
        ...utils.CONST.REDUX.BASE_PAGINATION,
        tags: [],
        status: -1,
        categoryId: -1
    }
};

function tagsReducer(state: IInitialTagsSliceState, action: ITagsAction) {
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

const useTags = () => {
    const tagsRef = useRef(initialTagsState);
    const [empty, setEmpty] = useState(false);
    const [tags, dispatch] = useReducer(tagsReducer, initialTagsState);

    useEffect(() => {
        setEmpty(tags.data.page === 1 && tags.data.tags.length === 0 && !tags.data.query);
    }, [tags.data]);

    const list = useCallback(async (args: Partial<ICPaginationArgs>) => {
        try {
            const cs = new TagService();
            const currentTagsStateData = tagsRef.current.data;

            const payload = {
                page: args.page ?? currentTagsStateData.page,
                query: args.query ?? currentTagsStateData.query,
                limit: args.limit ?? currentTagsStateData.limit,
                sort: args.sort ?? currentTagsStateData.sort,
                order: args.order ?? currentTagsStateData.order,
                status: args.status ?? currentTagsStateData.status,
                categoryId: args.categoryId ?? currentTagsStateData.categoryId,
            };

            tagsRef.current = {
                ...tagsRef.current,
                status: 'loading',
                data: {
                    ...tagsRef.current.data,
                    ...payload
                }
            };

            dispatch({
                type: 'GET',
                payload: tagsRef.current
            });

            const response = await cs.list(payload);

            tagsRef.current = {
                ...tagsRef.current,
                status: 'fulfilled',
                data: {
                    ...tags.data,
                    ...payload,
                    limit: response.data?.limit,
                    order: response.data?.order ?? payload.order,
                    sort: response.data?.sort ?? payload.sort,
                    page: response.data?.page ?? payload.page,
                    totalCount: response.data?.totalCount,
                    tags: response.data?.tags
                }
            };

            dispatch({
                type: 'GET',
                payload: tagsRef.current
            });
        } catch (error) {
            tagsRef.current = {
                ...tagsRef.current,
                status: 'failed'
            };

            dispatch({
                type: 'GET',
                payload: tagsRef.current
            });

            utils.toast.error({
                message: utils.error.getMessage(error)
            });
        }
    }, []);

    const push = (data: ITagPopulated) => {
        tagsRef.current = {
            ...tagsRef.current,
            data: {
                ...tags.data,
                tags: [data, ...tagsRef.current.data.tags],
                totalCount: tagsRef.current.data.totalCount + 1
            }
        };
        dispatch({
            type: 'GET',
            payload: tagsRef.current
        });
    };

    const update = (categoryId: string, data: ITagPopulated) => {
        const tags = [...tagsRef.current.data.tags];
        tags[tags.findIndex((r) => r._id === categoryId)] = data;
        tagsRef.current = {
            ...tagsRef.current,
            data: {
                ...tagsRef.current.data,
                tags
            }
        };
        dispatch({
            type: 'GET',
            payload: tagsRef.current
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
        const tags = [...tagsRef.current.data.tags];
        tags.splice(index, 1);
        tagsRef.current = {
            ...tagsRef.current,
            data: {
                ...tagsRef.current.data,
                tags,
                totalCount: tagsRef.current.data.totalCount + 1
            }
        };
        dispatch({
            type: 'GET',
            payload: tagsRef.current
        });
    };

    return {
        empty,
        update,
        push,
        onSearch,
        tags,
        list,
        delete: delete_
    };
};

export default useTags;
