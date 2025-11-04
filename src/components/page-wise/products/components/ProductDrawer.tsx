'use client';

// MUI Imports
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Divider, Drawer, MenuItem, Typography } from '@mui/material';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

// Hook Imports
import CommonButton from '@/components/common/CommonButton';

import CustomTextField from '@/@core/components/mui/TextField';
import themeConfig from '@/configs/themeConfig';
import { ICategory } from '@/models/category.model';
import { IProduct } from '@/models/product.model';
import { commonSchemas } from '@/schemas/common.schemas';
import { ProductService } from '@/services/client/Product.service';
import { utils } from '@/utils/utils';

type IProductProps = {
    create: boolean;
    onCreate: Function;
    onUpdate: Function;
    onClose: Function;
    product: IProduct | null;
    categories: ICategory[];
};

type FormData = (typeof commonSchemas.addProduct)['__outputType'];

const { NUMERIC_STATUS, STATUS } = utils.CONST.CATEGORY;

const DEFAULT_VALUE: FormData = {
    name: '',
    description: '',
    status: STATUS.ACTIVE,
    lanes: []
};

const ProductDrawer = (props: IProductProps) => {
    const { product, create, categories } = props;

    const [loading, setLoading] = useState(false);

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
        if (props.product) {
            reset({
                ...props.product
            });
        } else {
            reset({ ...DEFAULT_VALUE });
        }
    }, [props.product, create]);

    const onClose = () => {
        props.onClose();
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            if (!product && !props.create) throw utils.CONST.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG;

            setLoading(true);

            let response = utils.generateRes({ status: true });

            const ps = new ProductService();
            if (product?._id) {
                response = await ps.update(product?._id as string, data);
                props.onUpdate(response.data?.product);
            } else {
                response = await ps.create(data);
                props.onCreate(response.data?.product);
            }

            utils.toast.success({ message: response.message! });
            onClose();
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
        <Drawer
            anchor='right'
            open={Boolean(props.product || props.create)}
            onClose={onClose}
            ModalProps={{
                disablePortal: true,
                disableAutoFocus: true,
                disableScrollLock: true
            }}
            className={classNames('block', {
                static: !props.product,
                absolute: Boolean(props.product || props.create)
            })}
            PaperProps={{
                className: classNames('is-[400px] shadow-none rounded-s-[6px]', {
                    static: false
                })
            }}
            sx={{
                '& .MuiDrawer-paper': {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    width: 750
                },
                '& .MuiBackdrop-root': {
                    borderRadius: 1,
                    position: 'absolute'
                }
            }}
        >
            <form noValidate autoComplete='off' className='w-full'>
                <Box
                    className='is-full'
                    sx={{
                        paddingInline: 6,
                        paddingBlock: '15px'
                    }}
                >
                    <Typography
                        variant='h6'
                        sx={{
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {props.create ? 'Create' : 'Update'} Product
                    </Typography>
                </Box>

                <Divider className='is-full' />

                <Box
                    sx={{
                        paddingInline: 6,
                        paddingBlock: 5,
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
                        sx={{
                            mt: 4
                        }}
                    >
                        Lanes:
                    </Typography>

                    {lanes.fields.map((currentLane, laneIndex) => (
                        <>
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
                                            {categories.map((category) => (
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
                                        label="Remove Lane"
                                        size='small'
                                        variant='contained'
                                        className='max-w-fit'
                                        onClick={() => lanes.remove(laneIndex)}
                                    />
                                </Box>
                            </Box>
                        </>
                    ))}

                    <Box
                        sx={{
                            textAlign: 'right'
                        }}
                    >
                        <CommonButton
                            type='button'
                            label="Add Lane"
                            size='small'
                            variant='contained'
                            className='max-w-fit'
                            onClick={() => lanes.append({ laneTitle: '', categoryId: '-1', type: 'radio', options: [] })}
                        />
                    </Box>
                </Box>
            </form>

            <div className='is-full p-6 flex flex-col space-y-2 webkit-bottom'>
                <CommonButton
                    label={create ? 'Create' : 'Update'}
                    fullWidth
                    loading={loading}
                    variant='contained'
                    onClick={handleSubmit(onSubmit)}
                />
            </div>
        </Drawer>
    );
};

export default ProductDrawer;
