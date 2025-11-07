'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Divider, MenuItem, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

import CommonButton from '@/components/common/CommonButton';
import CustomNoRowsOverlay from '@/components/common/CommonCustomMessage';
import Loader from '@/components/Loader';

import CustomTextField from '@/@core/components/mui/TextField';
import themeConfig from '@/configs/themeConfig';
import { IProduct } from '@/models/product.model';
import { ITag } from '@/models/tag.model';
import { commonSchemas } from '@/schemas/common.schemas';
import { ProductService } from '@/services/client/Product.service';
import { TagService } from '@/services/client/Tag.service';
import { utils } from '@/utils/utils';

import LaneForm from './components/LaneForm';
import useCategories from '../categories/hooks/useCategories';

const { CONST } = utils;
const { NUMERIC_STATUS, STATUS } = CONST.CATEGORY;

type FormData = (typeof commonSchemas.addProduct)['__outputType'];
type IProductProps = { id?: string };

const DEFAULT_LANE: FormData['lanes'][0] = {
    laneTitle: '',
    categoryId: '-1',
    type: 'radio',
    options: [],
    presentTagOptions: [],
    selectedTagIds: []
};

const DEFAULT_VALUE: FormData = {
    name: '',
    description: '',
    status: STATUS.ACTIVE,
    lanes: [DEFAULT_LANE as any]
};

export default function Product({ id }: IProductProps) {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [productLoading, setProductLoading] = useState(false);
    const [product, setProduct] = useState<IProduct | null>(null);
    const { categories, list: listCategories } = useCategories();
    const [categoryIdTagsMap, setCategoryIdTagsMap] = useState(new Map<string, ITag[]>());

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        watch
    } = useForm<FormData>({
        resolver: yupResolver(commonSchemas.addProduct),
        defaultValues: DEFAULT_VALUE,
        mode: 'onSubmit'
    });

    const lanes = useFieldArray({ name: 'lanes', control });

    const loadProductAndCategories = useCallback(async () => {
        try {
            setProductLoading(true);
            const promises: Promise<any>[] = [];

            if (id) {
                const ps = new ProductService();
                promises.push(ps.get(id));
            } else {
                reset(DEFAULT_VALUE);
                promises.push(Promise.resolve(null));
            }

            promises.push(listCategories({ status: STATUS.ACTIVE }));

            const [productResponse] = await Promise.all(promises);

            if (productResponse?.status) {
                const product = productResponse.data.product;
                setProduct(product);
                reset(product);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setProductLoading(false);
        }
    }, [id, setProduct, reset]);

    /** 🔹 Fetch categories on mount */
    useEffect(() => {
        loadProductAndCategories();
    }, [loadProductAndCategories]);

    /** 🔹 Load tags for category */
    const loadTagsAgainstCategory = useCallback(
        async (categoryId: string, index: number) => {
            const selectedLane = { ...watch(`lanes.${index}`) };

            const updateLane = (tags: ITag[]) => {
                lanes.update(index, {
                    ...selectedLane,
                    categoryId,
                    presentTagOptions: tags.map((t) => ({ tagId: t._id as string, name: t.name })),
                    options: [],
                    selectedTagIds: []
                });
            };

            const existingTags = categoryIdTagsMap.get(categoryId);
            if (existingTags) return updateLane(existingTags);

            const ts = new TagService();
            const res = await ts.list({ page: 1, limit: 100, categoryId });
            const tags = res.data?.tags ?? [];
            setCategoryIdTagsMap(new Map(categoryIdTagsMap.set(categoryId, tags)));
            updateLane(tags);
        },
        [categoryIdTagsMap]
    );

    /** 🔹 Handle selected tags */
    const onSelectedTagsChange = useCallback(
        (index: number, selectedTagIds: string[]) => {
            const selectedLane = { ...watch(`lanes.${index}`) };
            const existing = selectedLane.options.filter((opt) => selectedTagIds.includes(opt.tagId));
            const existingIds = existing.map((o) => o.tagId);
            const added = (selectedLane.presentTagOptions ?? [])
                .filter((opt) => selectedTagIds.includes(opt.tagId) && !existingIds.includes(opt.tagId))
                .map((opt) => ({ tagId: opt.tagId, name: opt.name, price: 0 }));

            lanes.update(index, { ...selectedLane, options: [...existing, ...added] });
        },
        [watch]
    );

    /** 🔹 Submit handler */
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            if (!product && id) throw utils.CONST.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG;

            setLoading(true);

            const ps = new ProductService();
            data.lanes = data.lanes.map((l) => ({
                ...l,
                options: l.options.map((o) => ({ tagId: o.tagId, price: o.price }))
            }));

            const response = product?._id ? await ps.update(product._id as string, data) : await ps.create(data);

            utils.toast.success({ message: response.message! });

            router.push('/portal/products');
        } catch (error) {
            utils.toast.error({ message: utils.error.getMessage(error) });
        } finally {
            setLoading(false);
        }
    };

    if (id && categories.status !== 'loading' && !productLoading && !product) {
        return (
            <Box className='min-h-[80dvh] h-fulll w-full'>
                <CustomNoRowsOverlay message='Seems like we are unable to load the product' />
            </Box>
        );
    }

    return (
        <div className='space-y-4'>
            <Typography variant='h3'>{!id ? 'Create' : 'Update'} Product</Typography>

            {categories.status === 'loading' ? (
                <Box className='min-h-[70dvh] flex items-center justify-center'>
                    <Loader size='md' />
                </Box>
            ) : (
                <>
                    <form noValidate autoComplete='off'>
                        <Box display='flex' flexDirection='column' rowGap={4}>
                            {/* 🔹 Product Name */}
                            <Controller
                                name='name'
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        label='Name'
                                        placeholder='Enter name'
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                )}
                            />

                            {/* 🔹 Description */}
                            <Controller
                                name='description'
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        label='Description'
                                        placeholder='Enter description'
                                        multiline
                                        rows={4}
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                    />
                                )}
                            />

                            {/* 🔹 Status */}
                            <Controller
                                name='status'
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        select
                                        label='Status'
                                        SelectProps={{ MenuProps: themeConfig.components.select.MenuProps }}
                                        error={!!errors.status}
                                        helperText={errors.status?.message}
                                    >
                                        <MenuItem value={STATUS.ACTIVE}>{NUMERIC_STATUS[STATUS.ACTIVE]}</MenuItem>
                                        <MenuItem value={STATUS.INACTIVE}>{NUMERIC_STATUS[STATUS.INACTIVE]}</MenuItem>
                                    </CustomTextField>
                                )}
                            />

                            <Typography variant='body2' fontWeight={600} mt={4}>
                                Lanes:
                            </Typography>

                            {lanes.fields.map((lane, i) => (
                                <Fragment key={lane.id}>
                                    {i > 0 && <Divider />}
                                    <LaneForm
                                        control={control}
                                        errors={errors}
                                        categories={categories.data.categories}
                                        laneIndex={i}
                                        watch={watch}
                                        onRemove={() => lanes.remove(i)}
                                        loadTagsAgainstCategory={loadTagsAgainstCategory}
                                        onSelectedTagsChange={onSelectedTagsChange}
                                    />
                                </Fragment>
                            ))}

                            <Box
                                sx={{
                                    textAlign: 'right'
                                }}
                            >
                                <CommonButton
                                    type='button'
                                    label='Add Lane'
                                    size='small'
                                    variant='contained'
                                    className='max-w-fit'
                                    onClick={() => lanes.append(DEFAULT_LANE)}
                                />
                            </Box>
                        </Box>
                    </form>

                    <div className='w-full flex justify-end'>
                        <CommonButton
                            label={!id ? 'Create' : 'Update'}
                            loading={loading}
                            variant='contained'
                            onClick={handleSubmit(onSubmit)}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
