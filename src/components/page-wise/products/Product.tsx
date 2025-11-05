'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Divider, MenuItem, Typography } from '@mui/material';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

import CommonButton from '@/components/common/CommonButton';

import CustomTextField from '@/@core/components/mui/TextField';
import themeConfig from '@/configs/themeConfig';
import { IProduct } from '@/models/product.model';
import { ITag } from '@/models/tag.model';
import { commonSchemas } from '@/schemas/common.schemas';
import { ProductService } from '@/services/client/Product.service';
import { TagService } from '@/services/client/Tag.service';
import { utils } from '@/utils/utils';

import useCategories from '../categories/hooks/useCategories';

type FormData = (typeof commonSchemas.addProduct)['__outputType'];

type IProductProps = {
    create?: boolean;
};
const { CONST } = utils;
const { NUMERIC_STATUS, STATUS } = CONST.CATEGORY;

const DEFAULT_VALUE: FormData = {
    name: '',
    description: '',
    status: STATUS.ACTIVE,
    lanes: [
        {
            laneTitle: '',
            categoryId: '-1' as any,
            type: 'radio',
            options: []
        } as IProduct['lanes'][0]
    ]
};

const Product = (props: IProductProps) => {
    const [loading, setLoading] = useState(false);
    const [product] = useState<IProduct | null>(null);
    const { categories, list: listCategories } = useCategories();
    const [categoryIdTagsMap, setCategoryIdTagsMap] = useState(new Map<string, ITag[]>());

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormData>({
        resolver: yupResolver(commonSchemas.addProduct),
        defaultValues: { ...DEFAULT_VALUE }
    });

    const lanes = useFieldArray<FormData>({
        name: 'lanes',
        control
    });

    useEffect(() => {
        // if (props.product) {
        //     reset({
        //         ...props.product
        //     });
        // } else {
        reset({ ...DEFAULT_VALUE });
        // }
    }, []);

    const loadCategoriesNProducts = useCallback(async () => {
        await listCategories({
            status: CONST.CATEGORY.STATUS.ACTIVE
        });
    }, []);

    useEffect(() => {
        loadCategoriesNProducts();
    }, [loadCategoriesNProducts]);

    const loadTagsAgainstCategory = async (categoryId: string, index: number) => {
        if (categoryId === '-1') {
            lanes.update(index, {
                ...lanes.fields[index],
                categoryId,
                options: []
            });
            return;
        }

        let tags: ITag[] = [];

        const categoryIdTagsMap_ = new Map(categoryIdTagsMap);
        const alreadyLoadedTags = categoryIdTagsMap_.get(categoryId);

        if (alreadyLoadedTags) {
            setCategoryIdTagsMap(new Map(categoryIdTagsMap_));
            lanes.update(index, {
                ...lanes.fields[index],
                categoryId,
                options: alreadyLoadedTags.map((tag) => ({
                    tagId: tag._id as string,
                    price: 0,
                    name: tag.name
                }))
            });
            return;
        }

        const ts = new TagService();
        const loadTagsResponse = await ts.list({
            page: 1,
            limit: 100,
            categoryId
        });

        tags = loadTagsResponse.data?.tags ?? [];
        categoryIdTagsMap_.set(categoryId, tags);

        setCategoryIdTagsMap(new Map(categoryIdTagsMap_));

        lanes.update(index, {
            ...lanes.fields[index],
            categoryId,
            options: tags.map((tag) => ({
                tagId: tag._id as string,
                price: 0,
                name: tag.name
            }))
        });
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            if (!product && !props.create) throw utils.CONST.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG;

            setLoading(true);

            let response = utils.generateRes({ status: true });

            const ps = new ProductService();
            if (product?._id) {
                response = await ps.update(product?._id as string, data);
            } else {
                response = await ps.create(data);
            }

            utils.toast.success({ message: response.message! });
        } catch (error) {
            console.error(error);
            utils.toast.error({
                message: utils.error.getMessage(error)
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='space-y-4'>
            <Typography
                variant='h3'
                sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {props.create ? 'Create' : 'Update'} Product
            </Typography>

            <form noValidate autoComplete='off' className='w-full'>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: 4
                    }}
                    className='is-full'
                >
                    <Controller
                        name='name'
                        control={control}
                        render={({ field }) => {
                            return (
                                <CustomTextField
                                    {...field}
                                    type='text'
                                    label='Name'
                                    placeholder='Enter name'
                                    {...(errors.name && {
                                        error: true,
                                        helperText: utils.string.capitalize(errors.name.message, {
                                            capitalizeAll: false
                                        })
                                    })}
                                />
                            );
                        }}
                    />

                    <Controller
                        name='description'
                        control={control}
                        render={({ field }) => {
                            return (
                                <CustomTextField
                                    {...field}
                                    fullWidth
                                    rows={4}
                                    type='textarea'
                                    multiline
                                    label='Description'
                                    placeholder='Enter description'
                                    {...(errors.description && {
                                        error: true,
                                        helperText: utils.string.capitalize(errors.description.message, {
                                            capitalizeAll: false
                                        })
                                    })}
                                />
                            );
                        }}
                    />

                    <Controller
                        name='status'
                        control={control}
                        render={({ field }) => {
                            return (
                                <CustomTextField
                                    {...field}
                                    select
                                    type='select'
                                    defaultValue={-1}
                                    SelectProps={{
                                        MenuProps: themeConfig.components.select.MenuProps,
                                        multiple: false,
                                        onChange: (e) => {
                                            field.onChange(e);
                                        }
                                    }}
                                    label='Status'
                                    sx={{ paddingInlineEnd: 0, width: '100%' }}
                                    {...(errors.status && {
                                        error: true,
                                        helperText: utils.string.capitalize(errors.status.message, {
                                            capitalizeAll: false
                                        })
                                    })}
                                >
                                    <MenuItem value={STATUS.ACTIVE}>{NUMERIC_STATUS[STATUS.ACTIVE]}</MenuItem>
                                    <MenuItem value={STATUS.INACTIVE}>{NUMERIC_STATUS[STATUS.INACTIVE]}</MenuItem>
                                </CustomTextField>
                            );
                        }}
                    />

                    <Typography
                        variant='body2'
                        sx={{
                            mt: 4,
                            fontWeight: 600
                        }}
                    >
                        Lanes:
                    </Typography>

                    {lanes.fields.map((currentLane, laneIndex) => (
                        <Fragment key={`lane${laneIndex}`}>
                            {laneIndex ? <Divider className='is-full' /> : null}
                            <Box key={currentLane.id}>
                                <Typography variant='subtitle1' mb={2}>{`Lane #${laneIndex + 1}`}</Typography>

                                {/* Lane Title */}
                                <Controller
                                    name={`lanes.${laneIndex}.laneTitle`}
                                    control={control}
                                    render={({ field }) => (
                                        <CustomTextField
                                            {...field}
                                            type='text'
                                            label='Lane Title'
                                            placeholder='Enter lane title'
                                            fullWidth
                                            sx={{ mb: 2 }}
                                            {...(errors.lanes?.[laneIndex]?.laneTitle && {
                                                error: true,
                                                helperText: errors?.lanes?.[laneIndex]?.laneTitle?.message
                                            })}
                                        />
                                    )}
                                />

                                {/* Category */}
                                <Controller
                                    name={`lanes.${laneIndex}.categoryId`}
                                    control={control}
                                    render={({ field }) => (
                                        <CustomTextField
                                            {...field}
                                            select
                                            onChange={(e) => {
                                                field.onChange(e);
                                                loadTagsAgainstCategory(e.target.value, laneIndex);
                                            }}
                                            type='select'
                                            label='Category'
                                            placeholder='Select category'
                                            fullWidth
                                            sx={{ mb: 2 }}
                                            {...(errors.lanes?.[laneIndex]?.categoryId && {
                                                error: true,
                                                helperText: errors.lanes?.[laneIndex]?.categoryId?.message
                                            })}
                                        >
                                            <MenuItem value='-1'>Select</MenuItem>
                                            {categories.data.categories.map((category) => (
                                                <MenuItem key={category._id as string} value={category._id as string}>
                                                    {category.name}
                                                </MenuItem>
                                            ))}
                                        </CustomTextField>
                                    )}
                                />

                                {/* Type: radio/checkbox */}
                                <Controller
                                    name={`lanes.${laneIndex}.type`}
                                    control={control}
                                    render={({ field }) => (
                                        <CustomTextField
                                            {...field}
                                            select
                                            type='select'
                                            label='Type'
                                            fullWidth
                                            sx={{ mb: 2 }}
                                            {...(errors.lanes?.[laneIndex]?.type && {
                                                error: true,
                                                helperText: errors.lanes?.[laneIndex]?.type?.message
                                            })}
                                        >
                                            <MenuItem value='radio'>Single select (radio)</MenuItem>
                                            <MenuItem value='checkbox'>Multi select (checkbox)</MenuItem>
                                        </CustomTextField>
                                    )}
                                />

                                <Box
                                    sx={{
                                        mt: 1,
                                        textAlign: 'right'
                                    }}
                                >
                                    <CommonButton
                                        type='button'
                                        label='Remove Lane'
                                        size='small'
                                        variant='contained'
                                        className='max-w-fit'
                                        onClick={() => lanes.remove(laneIndex)}
                                    />
                                </Box>
                            </Box>
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
                            onClick={() =>
                                lanes.append({ laneTitle: '', categoryId: '-1', type: 'radio', options: [] })
                            }
                        />
                    </Box>
                </Box>
            </form>

            <div className='flex justify-end'>
                <CommonButton
                    label={props.create ? 'Create' : 'Update'}
                    fullWidth
                    loading={loading}
                    variant='contained'
                    className='!m-0'
                    onClick={handleSubmit(onSubmit)}
                />
            </div>
        </div>
    );
};

export default Product;
