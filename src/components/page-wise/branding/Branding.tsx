'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

import CommonButton from '@/components/common/CommonButton';
import CommonEntityContainer from '@/components/common/CommonEntityContainer';
import Loader from '@/components/Loader';

import TextField from '@/@core/components/mui/TextField';
import { commonSchemas } from '@/schemas/common.schemas';
import { ShopService } from '@/services/client/Shop.service';
import { utils } from '@/utils/utils';

type BrandingFormData = yup.InferType<typeof commonSchemas.branding>;

const INITIAL_STATE = {
    primaryColor: '#1976d2',
    secondaryColor: '#9c27b0',
    backgroundColor: '#cececeff',
    primaryTextColor: '#000000',
    secondaryTextColor: '#555555',
    thankYouMessage: '',
    headerText: '',
    footerText: ''
};

const iframeLink = 'https://example.com/embed-page'; // replace with your iframe link
const iframeCode = `<iframe src="${iframeLink}" width="100%" height="400" style="border:none;"></iframe>`;

const BrandingForm = () => {
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<BrandingFormData>({
        resolver: yupResolver(commonSchemas.branding),
        defaultValues: INITIAL_STATE
    });

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const ss = new ShopService();
            const data = await ss.get();
            const branding = { ...INITIAL_STATE, ...data.data.branding };
            reset(branding);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            utils.toast.error({ message: utils.error.getMessage(error) });
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const onSubmit: SubmitHandler<BrandingFormData> = async (data) => {
        try {
            const ss = new ShopService();
            await ss.update(data);
        } catch (error) {
            utils.toast.error({ message: utils.error.getMessage(error) });
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(iframeCode);
            utils.toast.success({ message: 'Iframe code copied!' });
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    if (loading)
        return (
            <Box className='min-h-[300px] flex items-center justify-center'>
                <Loader size='md' />
            </Box>
        );

    return (
        <div className='space-y-6'>
            <CommonEntityContainer
                title='Integration'
                description='Add this iframe anywhere to your website or customer portal'
                contentProps={{
                    sx: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }
                }}
            >
                <Typography fontSize={12} fontWeight={500}>
                    {iframeCode}
                </Typography>
                <Tooltip title='Copy iframe code'>
                    <IconButton size='small' onClick={handleCopy} color='primary'>
                        <ContentCopyIcon />
                    </IconButton>
                </Tooltip>
            </CommonEntityContainer>

            <CommonEntityContainer
                title='Branding Settings'
                description='Customize your store’s appearance and text shown to customers.'
            >
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    {/* Row 1 */}
                    <Grid container spacing={3} mb={2}>
                        <Grid item xs={12} md={4}>
                            <Controller
                                name='primaryColor'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type='color'
                                        fullWidth
                                        label='Primary Color'
                                        error={!!errors.primaryColor}
                                        helperText={errors.primaryColor?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Controller
                                name='secondaryColor'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type='color'
                                        fullWidth
                                        label='Secondary Color'
                                        error={!!errors.secondaryColor}
                                        helperText={errors.secondaryColor?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Controller
                                name='backgroundColor'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type='color'
                                        fullWidth
                                        label='Background Color'
                                        error={!!errors.backgroundColor}
                                        helperText={errors.backgroundColor?.message}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>

                    {/* Row 2 */}
                    <Grid container spacing={3} mb={2}>
                        <Grid item xs={12} md={4}>
                            <Controller
                                name='primaryTextColor'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type='color'
                                        fullWidth
                                        label='Primary Text Color'
                                        error={!!errors.primaryTextColor}
                                        helperText={errors.primaryTextColor?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Controller
                                name='secondaryTextColor'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type='color'
                                        fullWidth
                                        label='Secondary Text Color'
                                        error={!!errors.secondaryTextColor}
                                        helperText={errors.secondaryTextColor?.message}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>

                    {/* Text Fields */}
                    <Grid container spacing={3} mt={2}>
                        <Grid item xs={12}>
                            <Controller
                                name='thankYouMessage'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        label='Thank You Message'
                                        error={!!errors.thankYouMessage}
                                        helperText={errors.thankYouMessage?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} mt={2}>
                            <Controller
                                name='headerText'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label='Header Text'
                                        error={!!errors.headerText}
                                        helperText={errors.headerText?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} mt={2}>
                            <Controller
                                name='footerText'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label='Footer Text'
                                        error={!!errors.footerText}
                                        helperText={errors.footerText?.message}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>

                    <div className='w-full flex justify-end'>
                        <CommonButton loading={isSubmitting} label='Update' />
                    </div>
                </form>
            </CommonEntityContainer>
        </div>
    );
};

export default BrandingForm;
