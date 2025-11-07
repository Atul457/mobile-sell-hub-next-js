'use client';

import { Button, Card, CardContent, CardHeader, FormControl, MenuItem, Typography } from '@mui/material';
import { DataGrid, gridClasses, GridSortModel } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import CustomNoRowsOverlay from '@/components/common/CommonCustomMessage';

// import AlertModal from '@/components/modals/AlertModal';
import { useAppDispatch } from '@/store/hooks/hooks';

import CustomTextField from '@/@core/components/mui/TextField';
import themeConfig from '@/configs/themeConfig';
import { CONST } from '@/constants';
import { useConfigProviderContext } from '@/contexts/ConfigProvider';
import { IProduct } from '@/models/product.model';
import { utils } from '@/utils/utils';

import useProducts from './hooks/useProducts';
import { productsColumns } from './productsColumns';
import useCategories from '../categories/hooks/useCategories';

const { NUMERIC_STATUS, STATUS } = utils.CONST.CATEGORY;

type IProductsProps = {
    categoryId?: IProduct['id'];
};

const Products = (props: IProductsProps) => {
    const router = useRouter();
    const { categories, list: listCategories } = useCategories();
    const { products, list, onSearch: onSearch_, empty } = useProducts();

    const { permissions: _permissions } = useConfigProviderContext();
    const [productPermissions] = useState({
        create: true,
        update: true,
        read: true,
        delete: true
    });

    const dispatch = useAppDispatch();

    const productsColumns_ = useMemo(() => {
        return productsColumns({
            permissions: productPermissions,
            onEditClick: (product) => {
                router.push(`products/${product._id}`);
            }
        });
    }, [productPermissions]);

    const loadCategoriesNProducts = useCallback(async () => {
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
        loadCategoriesNProducts();
    }, [loadCategoriesNProducts]);

    // Handle type change
    const handleTypeChange = (status: IProduct['status'] | -1) => {
        list({
            status
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

    return (
        <>
            <Card style={{ width: '100%' }}>
                <CardHeader
                    className='max-md:block max-md:!items-start max-md:space-y-2'
                    sx={{ padding: 3 }}
                    title={
                        <Typography
                            variant='h3'
                            color='primary.main'
                            sx={{
                                fontSize: (theme) => theme.typography.h3
                            }}
                        >
                            List of All Products
                        </Typography>
                    }
                    action={
                        <div className='flex md:flex-wrap max-md:space-y-2 md:space-x-2 max-md:flex-col'>
                            <FormControl size='small'>
                                <CustomTextField
                                    select
                                    type='select'
                                    SelectProps={{
                                        MenuProps: themeConfig.components.select.MenuProps,
                                        multiple: false,
                                        onChange: (e) => {
                                            handleTypeChange(Number(e.target.value) as IProduct['status']);
                                        }
                                    }}
                                    label={null}
                                    className='max-md:w-full md:w-[200px]'
                                    sx={{
                                        paddingInlineEnd: 0
                                    }}
                                    value={products.data.status}
                                    onChange={(e) => {
                                        handleTypeChange(Number(e.target.value) as 0 | 1 | 2);
                                    }}
                                >
                                    <MenuItem value={-1}>All</MenuItem>
                                    <MenuItem value={STATUS.ACTIVE}>{NUMERIC_STATUS[STATUS.ACTIVE]}</MenuItem>
                                    <MenuItem value={STATUS.INACTIVE}>{NUMERIC_STATUS[STATUS.INACTIVE]}</MenuItem>
                                </CustomTextField>
                            </FormControl>

                            <div className='flex'>
                                <CustomTextField
                                    label={null}
                                    className='md:w-[300px] max-md:flex-grow'
                                    defaultValue=''
                                    onChange={(e) => onSearch(e.target.value)}
                                    name='name'
                                    placeholder='Enter product name or description'
                                />

                                <Button onClick={() => router.push('products/create')}>Add</Button>
                            </div>
                        </div>
                    }
                />
                <CardContent sx={{ padding: 0 }}>
                    <DataGrid
                        loading={[products.status, categories.status].includes('loading')}
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
                        rows={products.data?.products}
                        columns={productsColumns_}
                        rowCount={products.data.totalCount}
                        disableColumnMenu
                        pageSizeOptions={[10, 25, 50]}
                        paginationMode='server'
                        paginationModel={{
                            page: products.data.page - 1,
                            pageSize: products.data.limit
                        }}
                        onPaginationModelChange={onPaginationModalChange}
                        onSortModelChange={handleSortModelChange}
                        slots={{
                            noRowsOverlay: () => (
                                <CustomNoRowsOverlay
                                    message={empty ? 'It seems there are no products in the system.' : undefined}
                                />
                            )
                        }}
                    />
                </CardContent>
            </Card>
        </>
    );
};

export default Products;
