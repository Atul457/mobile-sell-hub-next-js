'use client';

// MUI Imports
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, IconButton, InputAdornment, Typography } from '@mui/material';
import clsx from 'clsx';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';

// Hook Imports
import CommonButton from '@/components/common/CommonButton';

import CustomTextField from '@/@core/components/mui/TextField';
import { commonSchemas } from '@/schemas/common.schemas';
import { http } from '@/utils/http';
import { utils } from '@/utils/utils';

type FormData = (typeof commonSchemas.shopRegister)['__outputType'];

const DEFAULT_VALUE: FormData = {
    firstName: '',
    lastName: '',
    email: '',
    storeName: '',
    phoneNumber: '',
    phoneNumber_: '',
    type: 2,
    password: '',
    confirmPassword: ''
};

const StoreSignupForm = () => {
    const [loading, setLoading] = useState(false);
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isCPasswordShown, setCIsPasswordShown] = useState(false);
    const handleClickShowPassword = () => setIsPasswordShown((show) => !show);
    const handlecClickShowPassword = () => setCIsPasswordShown((show) => !show);

    const {
        control,
        setValue,
        handleSubmit,
        formState: { errors, isSubmitted }
    } = useForm<FormData>({
        resolver: yupResolver(commonSchemas.shopRegister),
        defaultValues: { ...DEFAULT_VALUE }
    });

    const isSubmitted_ = isSubmitted;

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            setLoading(true);
            console.debug(data);
            const response = await http({
                url: 'shop-register',
                data,
                method: 'POST'
            });
            console.debug({ response });
        } catch (error) {
            console.error(error);
            console.debug('error:', utils.error.getMessage(error));
            utils.toast.error({
                message: utils.error.getMessage(error)
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form noValidate autoComplete='off' className='w-full'>
                <Box
                    className='is-full'
                    sx={{
                        paddingBlock: '15px',
                        borderBottom: '1px solid #fff'
                    }}
                >
                    <Typography
                        variant='h6'
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color: '#fff'
                        }}
                    >
                        Register shop
                    </Typography>
                </Box>

                <Box
                    sx={{
                        paddingBlock: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: 4
                    }}
                    className='is-full'
                >
                    <Controller
                        name='firstName'
                        control={control}
                        render={({ field }) => {
                            return (
                                <CustomTextField
                                    {...field}
                                    type='text'
                                    label='First Name'
                                    placeholder='Enter First name'
                                    error={!!errors.firstName}
                                    FormHelperTextProps={{ sx: { color: 'red!important' } }}
                                    {...(errors.firstName && {
                                        error: true,
                                        helperText: utils.string.capitalize(errors.firstName.message, {
                                            capitalizeAll: false
                                        })
                                    })}
                                />
                            );
                        }}
                    />
                    <Controller
                        name='lastName'
                        control={control}
                        render={({ field }) => {
                            return (
                                <CustomTextField
                                    {...field}
                                    type='text'
                                    label='Last Name'
                                    placeholder='Enter last name'
                                    {...(errors.lastName && {
                                        error: true,
                                        helperText: utils.string.capitalize(errors.lastName.message, {
                                            capitalizeAll: false
                                        })
                                    })}
                                />
                            );
                        }}
                    />

                    <Controller
                        name='storeName'
                        control={control}
                        render={({ field }) => {
                            return (
                                <CustomTextField
                                    {...field}
                                    type='text'
                                    label='Store Name'
                                    placeholder='Enter store name'
                                    error={!!errors.storeName}
                                    FormHelperTextProps={{ sx: { color: 'red!important' } }}
                                    {...(errors.storeName && {
                                        error: true,
                                        helperText: utils.string.capitalize(errors.storeName.message, {
                                            capitalizeAll: false
                                        })
                                    })}
                                />
                            );
                        }}
                    />

                    <Controller
                        name='email'
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                fullWidth
                                label='Email'
                                // className='max-lg:w-[calc(50%-6px)] lg:w-[calc(50%-8px)]'
                                error={!!errors.email}
                                FormHelperTextProps={{ sx: { color: 'red!important' } }}
                                placeholder='Enter Email'
                                {...(errors.email && {
                                    error: true,
                                    helperText: utils.string.capitalize(errors.email.message, {
                                        capitalizeAll: false
                                    })
                                })}
                            />
                        )}
                    />
                    <Controller
                        name='phoneNumber_'
                        control={control}
                        render={({ field: { ref, ...field } }) => (
                            <CustomTextField
                                {...{
                                    ...field,
                                    onChange: (e) => {
                                        let value = e.target.value;
                                        const value_ = utils.dom.onNumberTypeFieldChangeWithoutE(e.target.value, {
                                            maxLength: 10
                                        });
                                        setValue('phoneNumber', value_, {
                                            shouldValidate: isSubmitted_
                                        });
                                        e.target.value = value;
                                        field.onChange(e);
                                    }
                                }}
                                type='phone'
                                inputRef={ref}
                                fullWidth
                                label='Mobile Number'
                                placeholder='Enter your mobile number'
                                error={!!errors.phoneNumber}
                                FormHelperTextProps={{ sx: { color: 'red!important' } }}
                                {...(errors.phoneNumber && {
                                    error: true,
                                    helperText: errors.phoneNumber.message
                                })}
                            />
                        )}
                    />

                    <Controller
                        name='password'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                fullWidth
                                variant='filled'
                                label='Enter Password'
                                sx={{
                                    paddingInlineEnd: 0
                                }}
                                placeholder='Enter  password'
                                type={isPasswordShown ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton
                                                edge='end'
                                                onClick={handleClickShowPassword}
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                <i
                                                    className={clsx(
                                                        !isPasswordShown ? 'tabler-eye-off' : 'tabler-eye',
                                                        '!text-[#28282866]'
                                                    )}
                                                />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                error={!!errors.password}
                                FormHelperTextProps={{ sx: { color: 'red!important' } }}
                                {...(errors.password && {
                                    error: true,
                                    helperText: utils.string.capitalize(errors.password.message, {
                                        capitalizeAll: false
                                    })
                                })}
                            />
                        )}
                    />

                    <Controller
                        name='confirmPassword'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                fullWidth
                                variant='filled'
                                label='Confirm Password'
                                sx={{
                                    paddingInlineEnd: 0
                                }}
                                placeholder='Enter password again'
                                type={isCPasswordShown ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton
                                                edge='end'
                                                onClick={handlecClickShowPassword}
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                <i
                                                    className={clsx(
                                                        !isCPasswordShown ? 'tabler-eye-off' : 'tabler-eye',
                                                        '!text-[#28282866]'
                                                    )}
                                                />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                error={!!errors.confirmPassword}
                                FormHelperTextProps={{ sx: { color: 'red!important' } }}
                                {...(errors.confirmPassword && {
                                    error: true,
                                    helperText: utils.string.capitalize(errors.confirmPassword.message, {
                                        capitalizeAll: false
                                    })
                                })}
                            />
                        )}
                    />
                </Box>
            </form>

            <div className='is-full flex flex-col space-y-2 webkit-bottom'>
                <CommonButton
                    loading={loading}
                    label='Register'
                    size='small'
                    fullWidth
                    variant='contained'
                    btnVariant='white'
                    onClick={handleSubmit(onSubmit)}
                />
            </div>
        </>
    );
};

export default StoreSignupForm;
