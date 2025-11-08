'use client';

import { Button, Card, CardContent, CardHeader, FormControl, MenuItem, Typography } from '@mui/material';
import { DataGrid, gridClasses, GridSortModel } from '@mui/x-data-grid';
import { useEffect, useMemo, useRef, useState } from 'react';

import CustomNoRowsOverlay from '@/components/common/CommonCustomMessage';

// import AlertModal from '@/components/modals/AlertModal';
import { useAppDispatch } from '@/store/hooks/hooks';

import CustomTextField from '@/@core/components/mui/TextField';
import themeConfig from '@/configs/themeConfig';
import { useConfigProviderContext } from '@/contexts/ConfigProvider';
import { IProductCategory } from '@/models/product-category.model';
import { utils } from '@/utils/utils';

import ProductCategoryDrawer from './components/ProductCategoryDrawer';
import useProductCategories from './hooks/useProductCategories';
import { productCategoriesColumns } from './productCategoriesColumns';

const { NUMERIC_STATUS, STATUS } = utils.CONST.PRODUCT_CATEGORY;

type IProductCategoriesProps = {};

const ProductCategories = (_: IProductCategoriesProps) => {
    const { productCategories, list, onSearch: onSearch_, update, empty, push } = useProductCategories();

    const selectedProductCategoryRef = useRef<IProductCategory | null>(null);

    const [selected, setSelected] = useState<IProductCategory | null>(null);
    const [create, setCreate] = useState(false);
    const { permissions: _permissions } = useConfigProviderContext();
    const [productCategoryPermissions] = useState({
        create: true,
        update: true,
        read: true,
        delete: true
    });

    // console.debug({ permissions, productCategoryPermissions })

    const dispatch = useAppDispatch();

    const productCategoriesColumns_ = useMemo(() => {
        return productCategoriesColumns({
            permissions: productCategoryPermissions,
            onEditClick: (productCategory) => {
                selectedProductCategoryRef.current = productCategory;
                utils.dom.onModalOpen();
                setSelected(productCategory);
            }
        });
    }, [productCategoryPermissions]);

    useEffect(() => {
        list({});
    }, [dispatch]);

    // Handle type change
    const handleTypeChange = (status: IProductCategory['status'] | -1) => {
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

    const onUpdate = (productCategory: IProductCategory) => {
        if (selectedProductCategoryRef.current) {
            update(
                selectedProductCategoryRef.current?._id as string,
                {
                    ...selectedProductCategoryRef.current,
                    ...productCategory
                } as IProductCategory
            );
        }
    };

    const onCreate = (productCategory: IProductCategory) => {
        push({
            ...productCategory,
            id: productCategory._id
        } as IProductCategory);
    };

    // Modal close handler
    const onClose = () => {
        utils.dom.onModalClose();
        setSelected(null);
        setCreate(false);
    };

    return (
        <>
            <ProductCategoryDrawer
                create={create}
                onUpdate={onUpdate}
                onCreate={onCreate}
                productCategory={selected}
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
                            List of All Product Categories
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
                                            handleTypeChange(Number(e.target.value) as IProductCategory['status']);
                                        }
                                    }}
                                    label={null}
                                    sx={{
                                        paddingInlineEnd: 0,
                                        width: 200
                                    }}
                                    value={productCategories.data.status}
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
                                placeholder='Enter category name or description'
                            />

                            <Button onClick={() => setCreate(true)}>Add</Button>
                        </div>
                    }
                />
                <CardContent sx={{ padding: 0 }}>
                    <DataGrid
                        loading={productCategories.status === 'loading'}
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
                        rows={productCategories.data?.productCategories}
                        columns={productCategoriesColumns_}
                        rowCount={productCategories.data.totalCount}
                        disableColumnMenu
                        pageSizeOptions={[10, 25, 50]}
                        paginationMode='server'
                        paginationModel={{
                            page: productCategories.data.page - 1,
                            pageSize: productCategories.data.limit
                        }}
                        onPaginationModelChange={onPaginationModalChange}
                        onSortModelChange={handleSortModelChange}
                        slots={{
                            noRowsOverlay: () => (
                                <CustomNoRowsOverlay
                                    message={
                                        empty ? 'It seems there are no product categories in the system.' : undefined
                                    }
                                />
                            )
                        }}
                    />
                </CardContent>
            </Card>
        </>
    );
};

export default ProductCategories;
