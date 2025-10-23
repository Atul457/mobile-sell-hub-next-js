import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useEffect, useState } from 'react'
import { Controller, ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form'

import CustomTextField from '@/@core/components/mui/TextField'
import { useDataProviderContext } from '@/contexts/DataProvider'
import { useModal } from '@/contexts/ModalProvider'
import { commonSchemas } from '@/schemas/common.schemas'
import { CardService } from '@/services/client/Card.service'
import { toast } from '@/utils/toast'
import { utils } from '@/utils/utils'

import CommonButton from '../common/CommonButton'
import CommonDialog from '../common/CommonDialog'
import StripeInputWrapper from '../common/StripeInputwrapper'

type FormData = (typeof commonSchemas.addCard)['__outputType']

const INVALID_STRING_VALUE = 1 as unknown as string

const options = {
  style: {
    base: {
      color: '#002047',
      fontWeight: '500',
      fontSize: '16px',
      width: '100%',
      '::placeholder': { color: '#79798A' }
    }
  }
}

const AddCardModal = () => {
  const stripe = useStripe()
  const elements = useElements()
  const modalContext = useModal()
  const dataProviderContext = useDataProviderContext()

  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    setError,
    setValue
  } = useForm<FormData>({
    resolver: yupResolver(commonSchemas.addCard),
    defaultValues: {
      name: '',
      token: '',
      cardCvv: '',
      expiryDate: '',
      cardNumber: ''
    }
  })

  // Hooks

  useEffect(() => {
    if (dataProviderContext.state.profile) {
      setValue('name', utils.helpers.user.getFullName(dataProviderContext.state.profile))
    }
  }, [dataProviderContext.state.profile])

  const isSubmitted_ = isSubmitted

  const push = modalContext.modals.addCard?.push

  const handleClose = () => modalContext.closeModal('addCard')

  const onSubmit: SubmitHandler<FormData> = async (credentials: FormData) => {
    setLoading(true)

    if (!elements || !stripe) {
      return
    }

    try {
      const cardElement = elements.getElement(CardNumberElement)
      const expiryElement = elements.getElement(CardExpiryElement)
      const cvcElement = elements.getElement(CardCvcElement)

      if (!cardElement || !expiryElement || !cvcElement) {
        setLoading(false)
        return
      }

      const { token, error } = await stripe.createToken(cardElement)

      if (error) {
        toast.error({
          message: error.message ?? utils.CONST.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG
        })
        setLoading(false)
        return
      }

      if (token) {
        const tokenId = token.id

        const cs = new CardService()
        const response = await cs.create({
          name: credentials.name,
          token: tokenId
        })

        push?.(response.data?.card)

        utils.toast.success({ message: response.message! })
        handleClose()
      } else {
        throw Error('Token is empty')
      }
    } catch (error) {
      setLoading(false)
      utils.toast.error({ message: utils.error.getMessage(error) })
    }
  }

  const handleStripeElementsChange = (event: any, field: ControllerRenderProps<FormData>) => {
    if (event.error && isSubmitted_) {
      setError(field.name, event.error)
    } else {
      setValue(field.name, event.empty ? '' : !event.complete ? INVALID_STRING_VALUE : field.name, {
        shouldValidate: isSubmitted_
      })
    }
  }

  return (
    <CommonDialog open={true} onClose={handleClose}>
      <DialogTitle id='alert-dialog-title'>Add Card</DialogTitle>
      <DialogContent>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='name'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Enter your name'
                placeholder='Name on Card'
                sx={{ mb: 4 }}
                {...(errors.name && {
                  error: true,
                  helperText: utils.string.capitalize(errors.name.message, {
                    capitalizeAll: false
                  })
                })}
              />
            )}
          />

          <Controller
            name='cardNumber'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                onChange={event => handleStripeElementsChange(event, field as ControllerRenderProps<FormData>)}
                label='Card Number'
                placeholder='Card Number'
                fullWidth
                InputProps={{
                  inputComponent: StripeInputWrapper,
                  inputProps: {
                    component: CardNumberElement,
                    options: {
                      ...options,
                      placeholder: 'XXXX XXXX XXXX XXXX'
                    }
                  }
                }}
                {...(errors.cardNumber && {
                  error: true,
                  helperText: utils.string.capitalize(errors.cardNumber.message, {
                    capitalizeAll: false
                  })
                })}
              />
            )}
          />

          <Box sx={{ display: 'flex', gap: 6, mt: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Controller
                name='expiryDate'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    onChange={event => handleStripeElementsChange(event, field as ControllerRenderProps<FormData>)}
                    label='Exp Date (MM/YY)'
                    placeholder='MM/YY'
                    fullWidth
                    InputProps={{
                      inputComponent: StripeInputWrapper,
                      inputProps: {
                        component: CardExpiryElement,
                        options: {
                          ...options,
                          placeholder: 'MM/YY'
                        }
                      }
                    }}
                    {...(errors.expiryDate && {
                      error: true,
                      helperText: utils.string.capitalize(errors.expiryDate.message, {
                        capitalizeAll: false
                      })
                    })}
                  />
                )}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Controller
                name='cardCvv'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    onChange={event => handleStripeElementsChange(event, field as ControllerRenderProps<FormData>)}
                    label='CVV'
                    placeholder='CVV'
                    fullWidth
                    InputProps={{
                      inputComponent: StripeInputWrapper,
                      inputProps: {
                        component: CardCvcElement,
                        options: {
                          ...options,
                          placeholder: '****'
                        }
                      }
                    }}
                    {...(errors.cardCvv && {
                      error: true,
                      helperText: utils.string.capitalize(errors.cardCvv.message, {
                        capitalizeAll: false
                      })
                    })}
                  />
                )}
              />
            </Box>
          </Box>
        </form>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <CommonButton
          type='submit'
          variant='contained'
          onClick={handleSubmit(onSubmit)}
          loading={loading}
          label='Save Card'
        />
      </DialogActions>
    </CommonDialog>
  )
}

const MainElement = () => {
  const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY ?? '')

  return (
    <Elements stripe={stripePromise}>
      <AddCardModal />
    </Elements>
  )
}

export default MainElement
