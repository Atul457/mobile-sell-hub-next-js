'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  Card,
  CardContent,
  FormHelperText,
  Grid,
  InputLabel,
  TextField,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

// ✅ Validation schema
const brandingSchema = yup.object({
  primaryColor: yup.string().required('Primary color is required'),
  secondaryColor: yup.string().required('Secondary color is required'),
  backgroundColor: yup.string().required('Background color is required'),
  primaryTextColor: yup.string().required('Primary text color is required'),
  secondaryTextColor: yup.string().required('Secondary text color is required'),
  thankYouMessage: yup.string(),
  headerText: yup.string(),
  footerText: yup.string()
})

type BrandingFormData = yup.InferType<typeof brandingSchema>

const BrandingForm = () => {
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<BrandingFormData>({
    resolver: yupResolver(brandingSchema),
    defaultValues: {
      primaryColor: '#1976d2',
      secondaryColor: '#9c27b0',
      backgroundColor: '#cececeff',
      primaryTextColor: '#000000',
      secondaryTextColor: '#555555',
      thankYouMessage: '',
      headerText: '',
      footerText: ''
    }
  })

  const onSubmit: SubmitHandler<BrandingFormData> = async (data) => {
    setLoading(true)
    console.debug('Branding Data:', data)
    setTimeout(() => {
      setLoading(false)
    }, 800)
  }

  const ColorField = ({ name, label }: { name: keyof BrandingFormData; label: string }) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box>
          <InputLabel shrink sx={{ mb: 0.5, fontWeight: 500 }}>
            {label}
          </InputLabel>
          <Box display='flex' alignItems='center' gap={2}>
            <Box
              sx={{
                border: '1px solid #ddd',
                borderRadius: 1,
                p: 1,
                flex: 1,
                minWidth: 150
              }}
            >
              <input
                {...field}
                type='color'
                style={{
                  width: '100%',
                  height: '36px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer'
                }}
              />
            </Box>
          </Box>
          {errors[name] && (
            <FormHelperText error>{(errors[name]?.message as string) || ''}</FormHelperText>
          )}
        </Box>
      )}
    />
  )

  return (
    <Card>
      <CardContent>
      <Typography variant='h5' fontWeight={600} gutterBottom>
        Branding Settings
      </Typography>
      <Typography variant='body2' color='text.secondary' mb={4}>
        Customize your store’s appearance and text shown to customers.
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Row 1 */}
        <Grid container spacing={3} mb={2}>
          <Grid item xs={12} md={4}>
            <ColorField name='primaryColor' label='Primary Color' />
          </Grid>
          <Grid item xs={12} md={4}>
            <ColorField name='secondaryColor' label='Secondary Color' />
          </Grid>
          <Grid item xs={12} md={4}>
            <ColorField name='backgroundColor' label='Background Color' />
          </Grid>
        </Grid>

        {/* Row 2 */}
        <Grid container spacing={3} mb={2}>
          <Grid item xs={12} md={4}>
            <ColorField name='primaryTextColor' label='Primary Text Color' />
          </Grid>
          <Grid item xs={12} md={4}>
            <ColorField name='secondaryTextColor' label='Secondary Text Color' />
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

        <Box mt={8} display="flex" justifyContent="right">
          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={loading}
            sx={{ textTransform: 'none', px: 4 }}
          >
            {loading ? 'Saving...' : 'Save Branding'}
          </Button>
        </Box>
      </form>


    </CardContent></Card>
  )
}

export default BrandingForm
