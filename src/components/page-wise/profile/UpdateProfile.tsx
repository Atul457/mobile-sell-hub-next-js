// 'use client'

// import { yupResolver } from '@hookform/resolvers/yup'
// import { Box, IconButton, InputAdornment, Typography } from '@mui/material'
// import { useRouter } from 'next/navigation'
// import { signOut, useSession } from 'next-auth/react'
// import { ChangeEventHandler, useEffect, useState } from 'react'
// import Autocomplete from 'react-google-autocomplete'
// import type { SubmitHandler } from 'react-hook-form'
// import { Controller, useForm } from 'react-hook-form'

// import CommonButton from '@/components/common/CommonButton'

// import { useAppDispatch } from '@/store/slices/hooks/useAppDispatch'
// import { useAppSelector } from '@/store/slices/hooks/useAppSelector'
// import { userActions, userSelectors } from '@/store/slices/user/user.slice'

// // Third-party Imports
// import CustomTextField from '@/@core/components/mui/TextField'
// import { useModal } from '@/contexts/ModalProvider'
// import { IUser } from '@/models/user.model'
// import { commonSchemas } from '@/schemas/common.schemas'
// import { UserService } from '@/services/client/User.service'
// import { utils } from '@/utils/utils'
// import AuthFooter from '@/views/auth/AuthFooter'
// import ProfilePictureBox from '@/views/register/step-two/ProfilePictureBox'

// type IProfilePicture = {
//     src: string
//     file: File
// } | null

// type FormData = (typeof commonSchemas.updateProfileSchemaWithType)['__outputType']

// const USER_TYPES = utils.CONST.USER.TYPES

// const UpdateProfile = () => {
//     const [updating, setUpdating] = useState(false)
//     const [converting, setConverting] = useState(false)

//     // Hooks
//     const router = useRouter()
//     const session = useSession()
//     const dispatch = useAppDispatch()
//     const user = useAppSelector(userSelectors.user)

//     const {
//         control,
//         handleSubmit,
//         formState: { errors, isSubmitted },
//         reset,
//         setValue,
//         watch
//     } = useForm<FormData>({
//         resolver: yupResolver(commonSchemas.updateProfileSchemaWithType),
//         defaultValues: {
//             type: USER_TYPES.INDIVIDUAL,
//             firstName: '',
//             organizationName: '',
//             lastName: '',
//             address: '',
//             phoneNumber: '',
//             phoneNumber_: '',
//             addressMeta: utils.helpers.user.formatAddress()
//         }
//     })

//     const isSubmitted_ = isSubmitted
//     const coporateAccount = [USER_TYPES.GOVT_ORGANISATION, USER_TYPES.CORPORATE_EMPLOYER].includes(
//         watch('type') as IUser['type']
//     )
//     const STORAGE_PATH = utils.CONST.APP_CONST.CONFIG.STORAGE_PATH

//     // Hooks
//     const modalContext = useModal()

//     useEffect(() => {
//         if (!user) {
//             return
//         }

//         reset({
//             firstName: user.firstName,
//             lastName: user.lastName,
//             type: user.type,
//             address: user.address ?? '',
//             addressMeta: user.addressMeta ?? utils.helpers.user.formatAddress(),
//             phoneNumber: user.phoneNumber ?? '',
//             phoneNumber_: user.phoneNumber ?? '',
//             organizationName: user.organizationName ?? ''
//         })

//         if (user.profilePicture) {
//             const profilePicture = `${STORAGE_PATH}${user.profilePicture}`
//             setProfilePicture({
//                 src: profilePicture,
//                 file: new File([], '')
//             })
//         }
//     }, [user])

//     // Functions

//     const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
//         try {
//             setUpdating(true)
//             delete data.phoneNumber_
//             const userService = new UserService()
//             const response = await userService.update(data)

//             if (response.data) {
//                 dispatch(userActions.updateUser(response.data ?? {}))
//                 await session.update({
//                     info: response.data
//                 })
//             }

//             utils.toast.success({ message: utils.error.getMessage(response.message) })
//             setUpdating(false)
//         } catch (error: any) {
//             setUpdating(false)
//             console.error(error)
//         }
//     }

//     const onUpdatePasswordClick = () => {
//         modalContext.openModal({
//             type: 'updatePassword',
//             props: {
//                 visible: true
//             }
//         })
//     }

//     const onPlaceSelected = (data: google.maps.places.PlaceResult) => {
//         const extractionResult = utils.helpers.extractAddressDetails(data)
//         const formattedAddress = utils.helpers.user.formatAddress({
//             ...extractionResult,
//             city: extractionResult.city ?? '',
//             zipCode: extractionResult.postal_code ?? '',
//             state: extractionResult.administrative_area_level_2 ?? ''
//         })
//         setValue('addressMeta', formattedAddress)
//         setValue('address', data.formatted_address ?? null, {
//             shouldValidate: isSubmitted_
//         })
//     }

//     const clearInputField = () => {
//         setValue('address', '')
//         // setValue('addressMeta.appartment', '')
//         // setValue('addressMeta.city', '')
//         // setValue('addressMeta.country', '')
//         // setValue('addressMeta.state', '')
//         // setValue('addressMeta.zipCode', '')
//     }
//     return (
//         <>
//             <Box
//                 sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     flexDirection: 'column',
//                     height: '100%'
//                 }}
//             >

//                 <form
//                     noValidate
//                     autoComplete='off'
//                     onSubmit={handleSubmit(onSubmit)}
//                     className='flex flex-col gap-4 max-md:h-full'
//                 >
//                     <CustomTextField fullWidth label='Email' disabled={true} value={user?.email} placeholder='Enter your email' />

//                     <Box display='flex' flexWrap='wrap' justifyContent='space-between'>
//                         <Controller
//                             name='firstName'
//                             control={control}
//                             render={({ field }) => (
//                                 <CustomTextField
//                                     {...field}
//                                     fullWidth
//                                     label='First Name'
//                                     className='max-lg:w-[calc(50%-6px)] lg:w-[calc(50%-8px)]'
//                                     placeholder='Enter first name'
//                                     {...(errors.firstName && {
//                                         error: true,
//                                         helperText: utils.string.capitalize(errors.firstName.message, {
//                                             capitalizeAll: false
//                                         })
//                                     })}
//                                 />
//                             )}
//                         />

//                         <Controller
//                             name='lastName'
//                             control={control}
//                             render={({ field }) => (
//                                 <CustomTextField
//                                     {...field}
//                                     fullWidth
//                                     label='Last Name'
//                                     className='max-lg:w-[calc(50%-6px)] lg:w-[calc(50%-8px)]'
//                                     placeholder='Enter last name'
//                                     {...(errors.lastName && {
//                                         error: true,
//                                         helperText: utils.string.capitalize(errors.lastName.message, {
//                                             capitalizeAll: false
//                                         })
//                                     })}
//                                 />
//                             )}
//                         />
//                     </Box>

//                     {[USER_TYPES.GOVT_ORGANISATION, USER_TYPES.CORPORATE_EMPLOYER].includes(watch('type') as IUser['type']) ? (
//                         <>
//                             <Controller
//                                 name='organizationName'
//                                 control={control}
//                                 render={({ field }) => (
//                                     <CustomTextField
//                                         {...field}
//                                         fullWidth
//                                         label='Organization'
//                                         placeholder='Enter your organization name'
//                                         {...(errors.organizationName && {
//                                             error: true,
//                                             helperText: utils.string.capitalize(errors.organizationName.message, {
//                                                 capitalizeAll: false
//                                             })
//                                         })}
//                                     />
//                                 )}
//                             />
//                         </>
//                     ) : null}

//                     <Controller
//                         name='address'
//                         control={control}
//                         render={({ field }) => (
//                             <CustomTextField
//                                 {...field}
//                                 fullWidth
//                                 InputProps={{
//                                     inputComponent: Autocomplete,
//                                     inputProps: {
//                                         apiKey: process.env.GOOGLE_PLACES_API_KEY,
//                                         ...field,
//                                         onPlaceSelected,
//                                         options: {
//                                             types: ['address'],
//                                             fields: ['address_components', 'geometry.location', 'place_id', 'formatted_address']
//                                         }
//                                     },
//                                     endAdornment: !watch('address') ? undefined : (
//                                         <InputAdornment position='end'>
//                                             <IconButton edge='end' onClick={clearInputField} onMouseDown={e => e.preventDefault()}>
//                                                 <i className='tabler-x !text-[#28282866]' />
//                                             </IconButton>
//                                         </InputAdornment>
//                                     )
//                                 }}
//                                 label={`${coporateAccount ? 'Company' : 'Home'} Address`}
//                                 placeholder={`Enter your ${coporateAccount ? 'company' : 'home'} address`}
//                                 {...(errors.address && {
//                                     error: true,
//                                     helperText: utils.string.capitalize(errors.address.message, {
//                                         capitalizeAll: false
//                                     })
//                                 })}
//                             />
//                         )}
//                     />
//                     {/* {watch('address') && (
//             <>
//               <Box display='flex' flexWrap='wrap' justifyContent='space-between'>
//                 <Controller
//                   name='addressMeta.appartment'
//                   control={control}
//                   render={({ field }) => (
//                     <CustomTextField
//                       {...field}
//                       fullWidth
//                       InputProps={{
//                         inputProps: {
//                           apiKey: process.env.GOOGLE_PLACES_API_KEY,
//                           ...field,
//                           onPlaceSelected,
//                           options: {
//                             types: ['address'],
//                             fields: ['address_components', 'geometry.location', 'place_id', 'formatted_address']
//                           }
//                         }
//                       }}
//                       label='Suite, Apartment, Unit'
//                       placeholder='Enter Suite, Apartment, Unit'
//                       className='max-lg:w-[calc(50%-6px)] lg:w-[calc(50%-8px)]'
//                       {...(errors.addressMeta?.appartment && {
//                         error: true,
//                         helperText: utils.string.capitalize(errors.addressMeta.appartment.message, {
//                           capitalizeAll: false
//                         })
//                       })}
//                     />
//                   )}
//                 />

//                 <Controller
//                   name='addressMeta.city'
//                   control={control}
//                   rules={{ required: true }}
//                   render={({ field }) => (
//                     <CustomTextField
//                       {...field}
//                       fullWidth
//                       InputProps={{
//                         inputProps: {
//                           apiKey: process.env.GOOGLE_PLACES_API_KEY,
//                           ...field,
//                           onPlaceSelected,
//                           options: {
//                             types: ['address'],
//                             fields: ['address_components', 'geometry.location', 'place_id', 'formatted_address']
//                           }
//                         }
//                       }}
//                       label='City'
//                       placeholder='Enter City'
//                       className='max-lg:w-[calc(50%-6px)] lg:w-[calc(50%-8px)]'
//                       {...(errors.addressMeta?.city && {
//                         error: true,
//                         helperText: utils.string.capitalize(errors.addressMeta.city.message, {
//                           capitalizeAll: false
//                         })
//                       })}
//                     />
//                   )}
//                 />
//               </Box>
//               <Box display='flex' flexWrap='wrap' justifyContent='space-between'>
//                 <Controller
//                   name='addressMeta.state'
//                   control={control}
//                   render={({ field }) => (
//                     <CustomTextField
//                       {...field}
//                       fullWidth
//                       InputProps={{
//                         // inputComponent: Autocomplete,
//                         inputProps: {
//                           apiKey: process.env.GOOGLE_PLACES_API_KEY,
//                           ...field,
//                           onPlaceSelected,
//                           options: {
//                             types: ['address'],
//                             fields: ['address_components', 'geometry.location', 'place_id', 'formatted_address']
//                           }
//                         }
//                       }}
//                       label='State'
//                       placeholder='Enter State'
//                       className='max-lg:w-[calc(50%-6px)] lg:w-[calc(50%-8px)]'
//                       {...(errors.addressMeta?.state && {
//                         error: true,
//                         helperText: utils.string.capitalize(errors.addressMeta.state.message, {
//                           capitalizeAll: false
//                         })
//                       })}
//                     />
//                   )}
//                 />

//                 <Controller
//                   name='addressMeta.zipCode'
//                   control={control}
//                   render={({ field }) => (
//                     <CustomTextField
//                       {...field}
//                       fullWidth
//                       InputProps={{
//                         inputProps: {
//                           apiKey: process.env.GOOGLE_PLACES_API_KEY,
//                           ...field,
//                           onPlaceSelected,
//                           options: {
//                             types: ['address'],
//                             fields: ['address_components', 'geometry.location', 'place_id', 'formatted_address']
//                           }
//                         }
//                       }}
//                       label='Zip Code'
//                       placeholder='Enter Zip Code'
//                       className='max-lg:w-[calc(50%-6px)] lg:w-[calc(50%-8px)]'
//                       {...(errors.addressMeta?.zipCode && {
//                         error: true,
//                         helperText: utils.string.capitalize(errors.addressMeta.zipCode.message, {
//                           capitalizeAll: false
//                         })
//                       })}
//                     />
//                   )}
//                 />
//               </Box>
//             </>
//           )} */}

//                     <Controller
//                         name='phoneNumber_'
//                         control={control}
//                         render={({ field: { ref, ...field } }) => (
//                             <CustomTextField
//                                 {...{
//                                     ...field,
//                                     onChange: e => {
//                                         let value = e.target.value
//                                         const value_ = utils.dom.onNumberTypeFieldChangeWithoutE(e.target.value, { maxLength: 10 })
//                                         setValue('phoneNumber', value_, {
//                                             shouldValidate: isSubmitted_
//                                         })
//                                         e.target.value = value
//                                         field.onChange(e)
//                                     }
//                                 }}
//                                 type='phone'
//                                 inputRef={ref}
//                                 fullWidth
//                                 label='Mobile Number'
//                                 placeholder='Enter your mobile number'
//                                 {...(errors.phoneNumber && {
//                                     error: true,
//                                     helperText: errors.phoneNumber.message
//                                 })}
//                             />
//                         )}
//                     />

//                     <CustomTextField
//                         fullWidth
//                         variant='filled'
//                         label='Password'
//                         sx={{
//                             paddingInlineEnd: 0
//                         }}
//                         placeholder='Enter your password'
//                         type='password'
//                         value='000000000'
//                     // InputProps={{
//                     //     endAdornment: (
//                     //         <InputAdornment position='end'>
//                     //             <IconButton edge='end' onMouseDown={e => e.preventDefault()}>
//                     //                 <i className={clsx('tabler-eye-off', '!text-[#28282866]')} />
//                     //             </IconButton>
//                     //         </InputAdornment>
//                     //     )
//                     // }}
//                     />

//                     <Box
//                         sx={{
//                             display: 'flex',
//                             justifyContent: 'flex-end',
//                             marginBottom: 10
//                         }}
//                     >
//                         <Typography
//                             color='hyperlink.main'
//                             variant='inherit'
//                             fontWeight={600}
//                             onClick={() => onUpdatePasswordClick()}
//                             sx={{
//                                 cursor: 'pointer'
//                             }}
//                         >
//                             Change Password
//                         </Typography>
//                     </Box>

//                     <AuthFooter>
//                         <CommonButton loading={updating} label='Update' />
//                         <Box justifyContent='center' display='flex'>
//                             <Typography
//                                 // color='hyperlink.main'
//                                 color='red'
//                                 variant='inherit'
//                                 fontWeight={600}
//                                 onClick={() => deleteAccountButtonClick()}
//                                 sx={{
//                                     cursor: 'pointer'
//                                 }}
//                             >
//                                 Delete Account
//                             </Typography>
//                         </Box>
//                     </AuthFooter>
//                 </form>
//             </Box>
//         </>
//     )
// }

// export default UpdateProfile
