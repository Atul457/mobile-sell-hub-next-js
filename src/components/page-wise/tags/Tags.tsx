'use client';

import { Button, Card, CardContent, CardHeader, FormControl, MenuItem, Typography } from '@mui/material';
import { DataGrid, gridClasses, GridSortModel } from '@mui/x-data-grid';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import CustomNoRowsOverlay from '@/components/common/CommonCustomMessage';

// import AlertModal from '@/components/modals/AlertModal';
import { useAppDispatch } from '@/store/hooks/hooks';

import CustomTextField from '@/@core/components/mui/TextField';
import themeConfig from '@/configs/themeConfig';
import { CONST } from '@/constants';
import { useConfigProviderContext } from '@/contexts/ConfigProvider';
import { ITagPopulated } from '@/models/tag.model';
import { utils } from '@/utils/utils';

import TagDrawer from './components/TagDrawer';
import useTags from './hooks/useTags';
import { tagsColumns } from './tagsColumns';
import useCategories from '../categories/hooks/useCategories';

const { NUMERIC_STATUS, STATUS } = utils.CONST.CATEGORY;

type ITagsProps = {
    categoryId?: ITagPopulated['id'];
};

const Tags = (props: ITagsProps) => {
    const { categories, list: listCategories } = useCategories();
    const { tags, list, onSearch: onSearch_, update, empty, push } = useTags();

    const selectedTagRef = useRef<ITagPopulated | null>(null);

    const [selected, setSelected] = useState<ITagPopulated | null>(null);
    const [create, setCreate] = useState(false);
    const { permissions: _permissions } = useConfigProviderContext();
    const [tagPermissions] = useState({
        create: true,
        update: true,
        read: true,
        delete: true
    });

    const dispatch = useAppDispatch();

    const tagsColumns_ = useMemo(() => {
        return tagsColumns({
            permissions: tagPermissions,
            onEditClick: (tag) => {
                selectedTagRef.current = tag;
                utils.dom.onModalOpen();
                setSelected(tag);
            }
        });
    }, [tagPermissions]);

    const loadCategoriesNTags = useCallback(async () => {
        await listCategories({
            status: CONST.CATEGORY.STATUS.ACTIVE
        });
        await list({
            ...(props.categoryId && {
                categoryId: props.categoryId
            })
        });
    }, [dispatch, props.categoryId]);

    useEffect(() => {
        loadCategoriesNTags();
    }, [loadCategoriesNTags]);

    // Handle type change
    const handleTypeChange = (status: ITagPopulated['status'] | -1) => {
        list({
            status
        });
    };

    const handleCategoryChange = (categoryId: ITagPopulated['categoryId'] | -1) => {
        list({
            categoryId
        });
    };

    const onSearch = utils.debounce((query) => {
        onSearch_(query);
    }, 300);

    const onPaginationModalChange = ({ page, pageSize }: { page: number; pageSize: number }) => {
        list({
            page: page + 1,
            limit: pageSize
        });
    };

    const handleSortModelChange = (sortModel: GridSortModel) => {
        if (sortModel.length > 0) {
            list({
                sort: sortModel[0].field,
                order: sortModel[0].sort
            });
        }
    };

    const onUpdate = (tag: ITagPopulated) => {
        if (selectedTagRef.current) {
            update(
                selectedTagRef.current?._id as string,
                {
                    ...selectedTagRef.current,
                    ...tag
                } as ITagPopulated
            );
        }
    };

    const onCreate = (tag: ITagPopulated) => {
        push({
            ...tag,
            id: tag._id
        } as ITagPopulated);
    };

    // Modal close handler
    const onClose = () => {
        utils.dom.onModalClose();
        setSelected(null);
        setCreate(false);
    };

    return (
        <>
            <TagDrawer
                create={create}
                categories={categories.data?.categories ?? []}
                onUpdate={onUpdate}
                onCreate={onCreate}
                tag={selected}
                onClose={onClose}
            />

            <Card style={{ width: '100%' }}>
                <CardHeader
                    sx={{ padding: 3 }}
                    title={
                        <Typography
                            variant='h3'
                            color='primary.main'
                            sx={{
                                fontSize: (theme) => theme.typography.h3
                            }}
                        >
                            List of All Tags
                        </Typography>
                    }
                    action={
                        <div className='flex flex-wrap space-x-2'>
                            <FormControl size='small'>
                                <CustomTextField
                                    select
                                    type='select'
                                    SelectProps={{
                                        MenuProps: themeConfig.components.select.MenuProps,
                                        multiple: false,
                                        onChange: (e) => {
                                            handleCategoryChange(e.target.value as ITagPopulated['categoryId']);
                                        }
                                    }}
                                    label={null}
                                    sx={{
                                        paddingInlineEnd: 0,
                                        width: 200
                                    }}
                                    value={tags.data.categoryId}
                                    onChange={(e) => {
                                        handleCategoryChange(e.target.value as ITagPopulated['categoryId']);
                                    }}
                                >
                                    <MenuItem value={-1}>Select Category</MenuItem>
                                    {(categories.data.categories ?? []).map((category) => {
                                        return (
                                            <MenuItem key={category._id as string} value={category._id as string}>
                                                {category.name}
                                            </MenuItem>
                                        );
                                    })}
                                </CustomTextField>
                            </FormControl>

                            <FormControl size='small'>
                                <CustomTextField
                                    select
                                    type='select'
                                    SelectProps={{
                                        MenuProps: themeConfig.components.select.MenuProps,
                                        multiple: false,
                                        onChange: (e) => {
                                            handleTypeChange(Number(e.target.value) as ITagPopulated['status']);
                                        }
                                    }}
                                    label={null}
                                    sx={{
                                        paddingInlineEnd: 0,
                                        width: 200
                                    }}
                                    value={tags.data.status}
                                    onChange={(e) => {
                                        handleTypeChange(Number(e.target.value) as 0 | 1 | 2);
                                    }}
                                >
                                    <MenuItem value={-1}>All</MenuItem>
                                    <MenuItem value={STATUS.ACTIVE}>{NUMERIC_STATUS[STATUS.ACTIVE]}</MenuItem>
                                    <MenuItem value={STATUS.INACTIVE}>{NUMERIC_STATUS[STATUS.INACTIVE]}</MenuItem>
                                </CustomTextField>
                            </FormControl>

                            <CustomTextField
                                label={null}
                                sx={{
                                    width: 300
                                }}
                                defaultValue=''
                                onChange={(e) => onSearch(e.target.value)}
                                name='name'
                                placeholder='Enter tag name or description'
                            />

                            <Button onClick={() => setCreate(true)}>Add</Button>
                        </div>
                    }
                />
                <CardContent sx={{ padding: 0 }}>
                    <DataGrid
                        loading={tags.status === 'loading'}
                        sx={{
                            [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                                outline: 'transparent'
                            },
                            [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: {
                                outline: 'none'
                            }
                        }}
                        autoHeight
                        sortingMode='server'
                        rowSelection={false}
                        rows={tags.data?.tags}
                        columns={tagsColumns_}
                        rowCount={tags.data.totalCount}
                        disableColumnMenu
                        pageSizeOptions={[10, 25, 50]}
                        paginationMode='server'
                        paginationModel={{
                            page: tags.data.page - 1,
                            pageSize: tags.data.limit
                        }}
                        onPaginationModelChange={onPaginationModalChange}
                        onSortModelChange={handleSortModelChange}
                        slots={{
                            noRowsOverlay: () => (
                                <CustomNoRowsOverlay
                                    message={empty ? 'It seems there are no tags in the system.' : undefined}
                                />
                            )
                        }}
                    />
                </CardContent>
            </Card>
        </>
    );
};

export default Tags;
