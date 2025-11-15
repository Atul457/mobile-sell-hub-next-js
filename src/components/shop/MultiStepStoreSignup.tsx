'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import {
    Box,
    Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Step,
    StepLabel,
    Stepper,
    Typography
} from '@mui/material';
import clsx from 'clsx';
import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';

import CommonButton from '@/components/common/CommonButton';

// your UI components + utils (project-specific)
import Error from '@/@core/components/mui/Error';
import CustomTextField from '@/@core/components/mui/TextField';
import { commonSchemas } from '@/schemas/common.schemas';
import { ShopService } from '@/services/client/Shop.service';
import { utils } from '@/utils/utils';

type FormValues = yup.InferType<typeof commonSchemas.createShopSchema>;

const DEFAULT_VALUES: FormValues = {
    business: {
        companyName: '',
        companyNumber: '',
        addressStreet: '',
        addressSuburb: '',
        addressCity: '',
        addressPostcode: '',
        businessEmail: '',
        businessPhone: ''
    },
    admin: {
        firstName: '',
        lastName: '',
        role: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    },
    directors: [], // start empty
    subscription: {
        plan: 'monthly',
        paymentMethod: 'card',
        billingName: '',
        billingEmail: '',
        billingAddress: '',
        termsAccepted: false
    }
};

/* -------------------------
   Component
   ------------------------- */

const STEPS = ['Business Information', 'Contact', 'Directors', 'Subscription & Billing'];

export default function MultiStepStoreSignupMultiStepStoreSignup() {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isCPasswordShown, setIsCPasswordShown] = useState(false);
    const [sucessSecton, setSucessSection] = useState(false);

    const {
        control,
        handleSubmit,
        trigger,
        setValue,
        reset,
        formState: { errors, isSubmitted }
    } = useForm<FormValues>({
        resolver: yupResolver(commonSchemas.createShopSchema),
        defaultValues: DEFAULT_VALUES,
        mode: 'onChange'
    });

    // directors field array
    const {
        fields: directorsFields,
        append: appendDirector,
        remove: removeDirector
    } = useFieldArray({
        control,
        name: 'directors'
    });

    const isLastStep = activeStep === STEPS.length - 1;

    const handleNext = async () => {
        // trigger validation only for current step's fields
        let ok = false;
        if (activeStep === 0) {
            ok = await trigger('business');
        } else if (activeStep === 1) {
            ok = await trigger('admin');
        } else if (activeStep === 2) {
            // validate directors array (if any)
            ok = await trigger('directors');
        } else if (activeStep === 3) {
            ok = await trigger('subscription');
        }

        if (ok) setActiveStep((s) => Math.min(s + 1, STEPS.length - 1));
    };

    const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0));

    const onSubmit = async (data: FormValues) => {
        try {
            setLoading(true);
            const ss = new ShopService();
            await ss.register(data);
            utils.toast.success({ message: 'Thank you for registering your shop with 73 Inc.' });
            setSucessSection(true);
            setActiveStep(0);
            reset(DEFAULT_VALUES);
        } catch (err) {
            const message = utils.error.getMessage(err);
            utils.toast.error({ message });
        } finally {
            setLoading(false);
        }
    };

    /* helper to add director - guard max 3 */
    const handleAddDirector = () => {
        if ((directorsFields?.length ?? 0) >= 3) {
            utils.toast.error({ message: 'You can add up to 3 directors only' });
            return;
        }
        appendDirector({
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            mobile: ''
        });
    };

    /* phone onChange helper preserving previous pattern used in your code */
    const handlePhoneInputChange = (fieldName: string, rawValue: string) => {
        // tries to use utils.dom.onNumberTypeFieldChangeWithoutE if available
        let val = rawValue;
        if (utils?.dom?.onNumberTypeFieldChangeWithoutE) {
            val = utils.dom.onNumberTypeFieldChangeWithoutE(rawValue, { maxLength: 15 });
        } else {
            // fallback: strip non-digits
            val = rawValue.replace(/\D/g, '');
        }
        setValue(fieldName as any, val, { shouldValidate: isSubmitted });
    };

    if (sucessSecton) {
        return (
            <Box>
                <Typography fontSize={20} sx={{ mb: 4 }}>
                    Thank you for registering your shop with 73 Inc.
                </Typography>
                <Typography>
                    Your account is currently in a pending state. Our team will contact you soon via your registered
                    mobile number or email to verify your details and complete the setup process.
                </Typography>
            </Box>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete='off' className='w-full registerform space-y-4'>
            <Box>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {STEPS.map((label, index) => (
                        <Step key={label}>
                            <StepLabel
                                sx={{
                                    mt: 0
                                }}
                            >
                                <Typography
                                    sx={{
                                        ...(index <= activeStep && {
                                            color: 'primary.main'
                                        }),
                                        fontWeight: 600
                                    }}
                                    variant='subtitle1'
                                >
                                    {label}
                                </Typography>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            <Typography variant='h5' className='mb-1 font-semibold'>
                {STEPS[activeStep]}
            </Typography>

            {/* ---------------- STEP 1: Business ---------------- */}
            {activeStep === 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Controller
                        name='business.companyName'
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                label='Company / Trading Name'
                                placeholder='As it will appear on the sub-domain'
                                error={!!(errors as any)?.business?.companyName}
                                helperText={(errors as any)?.business?.companyName?.message || ''}
                            />
                        )}
                    />

                    <Controller
                        name='business.companyNumber'
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                label='Company Number or NZBN'
                                placeholder='Company Number or NZBN'
                                error={!!(errors as any)?.business?.companyNumber}
                                helperText={(errors as any)?.business?.companyNumber?.message || ''}
                            />
                        )}
                    />
                    <Controller
                        name='business.addressStreet'
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                label='Street'
                                placeholder='Street address'
                                error={!!(errors as any)?.business?.addressStreet}
                                helperText={(errors as any)?.business?.addressStreet?.message || ''}
                            />
                        )}
                    />

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name='business.addressSuburb'
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        fullWidth
                                        label='Suburb'
                                        placeholder='Suburb'
                                        error={!!(errors as any)?.business?.addressSuburb}
                                        helperText={(errors as any)?.business?.addressSuburb?.message || ''}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Controller
                                name='business.addressCity'
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        label='City'
                                        placeholder='City'
                                        error={!!(errors as any)?.business?.addressCity}
                                        helperText={(errors as any)?.business?.addressCity?.message || ''}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Controller
                                name='business.addressPostcode'
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        label='Postcode'
                                        placeholder='Postcode'
                                        error={!!(errors as any)?.business?.addressPostcode}
                                        helperText={(errors as any)?.business?.addressPostcode?.message || ''}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>

                    <Controller
                        name='business.businessEmail'
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                label='Business Email'
                                placeholder='For official notifications'
                                error={!!(errors as any)?.business?.businessEmail}
                                helperText={(errors as any)?.business?.businessEmail?.message || ''}
                            />
                        )}
                    />

                    <Controller
                        name='business.businessPhone'
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                label='Business Contact Number'
                                placeholder='Mobile or landline'
                                inputProps={{ inputMode: 'numeric' }}
                                onChange={(e) => {
                                    handlePhoneInputChange('business.businessPhone', e.target.value);
                                }}
                                error={!!(errors as any)?.business?.businessPhone}
                                helperText={(errors as any)?.business?.businessPhone?.message || ''}
                            />
                        )}
                    />
                </Box>
            )}

            {/* ---------------- STEP 2: Primary Contact / Admin ---------------- */}
            {activeStep === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Controller
                        name='admin.firstName'
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                label='First Name'
                                placeholder='First name'
                                error={!!(errors as any)?.admin?.firstName}
                                helperText={(errors as any)?.admin?.firstName?.message || ''}
                            />
                        )}
                    />

                    <Controller
                        name='admin.lastName'
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                label='Last Name'
                                placeholder='Last name'
                                error={!!(errors as any)?.admin?.lastName}
                                helperText={(errors as any)?.admin?.lastName?.message || ''}
                            />
                        )}
                    />

                    <Controller
                        name='admin.role'
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                label='Position / Role (optional)'
                                placeholder='e.g., Director / Manager'
                                error={!!(errors as any)?.admin?.role}
                                helperText={(errors as any)?.admin?.role?.message || ''}
                            />
                        )}
                    />

                    <Controller
                        name='admin.email'
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                label='Email (login + communication)'
                                placeholder='Admin email'
                                error={!!(errors as any)?.admin?.email}
                                helperText={(errors as any)?.admin?.email?.message || ''}
                            />
                        )}
                    />

                    <Controller
                        name='admin.mobile'
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                label='Mobile Number'
                                placeholder='Admin mobile number'
                                inputProps={{ inputMode: 'numeric' }}
                                onChange={(e) => handlePhoneInputChange('admin.mobile', e.target.value)}
                                error={!!(errors as any)?.admin?.mobile}
                                helperText={(errors as any)?.admin?.mobile?.message || ''}
                            />
                        )}
                    />

                    <Controller
                        name='admin.password'
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                label='Password'
                                placeholder='Enter password'
                                type={isPasswordShown ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton
                                                edge='end'
                                                onClick={() => setIsPasswordShown((s) => !s)}
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                <i
                                                    className={clsx(!isPasswordShown ? 'tabler-eye-off' : 'tabler-eye')}
                                                />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                error={!!(errors as any)?.admin?.password}
                                helperText={(errors as any)?.admin?.password?.message || ''}
                            />
                        )}
                    />

                    <Controller
                        name='admin.confirmPassword'
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                label='Confirm Password'
                                placeholder='Confirm password'
                                type={isCPasswordShown ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton
                                                edge='end'
                                                onClick={() => setIsCPasswordShown((s) => !s)}
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                <i
                                                    className={clsx(
                                                        !isCPasswordShown ? 'tabler-eye-off' : 'tabler-eye'
                                                    )}
                                                />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                error={!!(errors as any)?.admin?.confirmPassword}
                                helperText={(errors as any)?.admin?.confirmPassword?.message || ''}
                            />
                        )}
                    />
                </Box>
            )}

            {/* ---------------- STEP 3: Directors ---------------- */}
            {activeStep === 2 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ color: '#000' }}>Directors (up to 3)</Typography>
                        <Box>
                            <IconButton
                                onClick={handleAddDirector}
                                disabled={directorsFields.length === 3}
                                sx={{
                                    color: 'text.primary',
                                    fontSize: '14px'
                                }}
                            >
                                <i className='tabler-plus text-[18px] hover:text-[var(--mui-palette-hyperlink-main)] transition-all'></i>
                            </IconButton>
                            Add Director
                        </Box>
                        {/* <CommonButton label="" size="small" onClick={handleAddDirector} /> */}
                    </Box>

                    {!directorsFields.length ? (
                        <Typography variant='caption'>No directors added yet. Add if applicable.</Typography>
                    ) : null}

                    {directorsFields.map((dir, idx) => (
                        <Box key={dir.id} sx={{ border: '1px solid rgba(255,255,255,0.06)', p: 2, borderRadius: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <Controller
                                        name={`directors.${idx}.firstName`}
                                        control={control}
                                        render={({ field }) => (
                                            <CustomTextField
                                                {...field}
                                                label='First Name'
                                                placeholder='Director first name'
                                                error={!!(errors as any)?.directors?.[idx]?.firstName}
                                                helperText={(errors as any)?.directors?.[idx]?.firstName?.message || ''}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Controller
                                        name={`directors.${idx}.middleName`}
                                        control={control}
                                        render={({ field }) => (
                                            <CustomTextField
                                                {...field}
                                                label='Middle Name (optional)'
                                                placeholder='Middle name'
                                                error={!!(errors as any)?.directors?.[idx]?.middleName}
                                                helperText={
                                                    (errors as any)?.directors?.[idx]?.middleName?.message || ''
                                                }
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Controller
                                        name={`directors.${idx}.lastName`}
                                        control={control}
                                        render={({ field }) => (
                                            <CustomTextField
                                                {...field}
                                                label='Last Name'
                                                placeholder='Last name'
                                                error={!!(errors as any)?.directors?.[idx]?.lastName}
                                                helperText={(errors as any)?.directors?.[idx]?.lastName?.message || ''}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} md={5}>
                                    <Controller
                                        name={`directors.${idx}.email`}
                                        control={control}
                                        render={({ field }) => (
                                            <CustomTextField
                                                {...field}
                                                label='Email'
                                                fullWidth
                                                placeholder='Director email'
                                                error={!!(errors as any)?.directors?.[idx]?.email}
                                                helperText={(errors as any)?.directors?.[idx]?.email?.message || ''}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name={`directors.${idx}.mobile`}
                                        control={control}
                                        render={({ field }) => (
                                            <CustomTextField
                                                {...field}
                                                label='Mobile'
                                                placeholder='Director mobile'
                                                fullWidth
                                                inputProps={{ inputMode: 'numeric' }}
                                                onChange={(e) =>
                                                    handlePhoneInputChange(`directors.${idx}.mobile`, e.target.value)
                                                }
                                                error={!!(errors as any)?.directors?.[idx]?.mobile}
                                                helperText={(errors as any)?.directors?.[idx]?.mobile?.message || ''}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={1}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                        <IconButton
                                            onClick={() => removeDirector(idx)}
                                            sx={{
                                                color: 'text.primary',
                                                fontSize: '14px'
                                            }}
                                        >
                                            <i className='tabler-trash text-[18px] hover:text-[var(--mui-palette-hyperlink-main)] transition-all'></i>
                                        </IconButton>
                                        {/* <CommonButton
                  size="small"
                  label="Remove"
                  onClick={() => removeDirector(idx)}
                /> */}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    ))}
                </Box>
            )}

            {/* ---------------- STEP 4: Subscription & Billing ---------------- */}
            {activeStep === 3 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Controller
                        name='subscription.plan'
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                select
                                label='Subscription Plan'
                                helperText={(errors as any)?.subscription?.plan?.message || ''}
                            >
                                <MenuItem value='monthly'>Monthly</MenuItem>
                                <MenuItem value='annual'>Annual</MenuItem>
                            </CustomTextField>
                        )}
                    />

                    <Controller
                        name='subscription.paymentMethod'
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                select
                                label='Preferred Payment Method'
                                helperText={(errors as any)?.subscription?.paymentMethod?.message || ''}
                            >
                                <MenuItem value='card'>Card</MenuItem>
                                <MenuItem value='bank'>Bank Transfer</MenuItem>
                            </CustomTextField>
                        )}
                    />

                    <Controller
                        name='subscription.billingName'
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                label='Billing Contact Name'
                                placeholder='Billing contact name'
                                error={!!(errors as any)?.subscription?.billingName}
                                helperText={(errors as any)?.subscription?.billingName?.message || ''}
                            />
                        )}
                    />

                    <Controller
                        name='subscription.billingEmail'
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                label='Billing Contact Email'
                                placeholder='Billing email'
                                error={!!(errors as any)?.subscription?.billingEmail}
                                helperText={(errors as any)?.subscription?.billingEmail?.message || ''}
                            />
                        )}
                    />

                    <Controller
                        name='subscription.billingAddress'
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                label='Billing Address (optional)'
                                placeholder='Billing address'
                                error={!!(errors as any)?.subscription?.billingAddress}
                                helperText={(errors as any)?.subscription?.billingAddress?.message || ''}
                            />
                        )}
                    />

                    <Controller
                        name='subscription.termsAccepted'
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={!!field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                    />
                                }
                                label='I agree to the Terms of Service & Privacy Policy'
                            />
                        )}
                    />
                    {errors?.subscription?.termsAccepted?.message && (
                        <Error message={errors?.subscription?.termsAccepted?.message} />
                    )}
                </Box>
            )}

            {/* ---------------- Actions ---------------- */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, mt: 4 }}>
                <Box sx={{ minWidth: 120 }}>
                    {activeStep > 0 && <CommonButton label='Back' variant='contained' onClick={handleBack} />}
                </Box>

                <Box sx={{ marginLeft: 'auto' }}>
                    {!isLastStep ? (
                        <CommonButton type='button' label='Next' variant='contained' onClick={handleNext} />
                    ) : (
                        <CommonButton
                            type='button'
                            loading={loading}
                            label='Submit'
                            variant='contained'
                            onClick={handleSubmit(onSubmit)}
                        />
                    )}
                </Box>
            </Box>
        </form>
    );
}
