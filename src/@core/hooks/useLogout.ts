import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

import { useAppDispatch } from '@/store/hooks/hooks'
import { userActions } from '@/store/slices/user/user.slice'

import { useModal } from '@/contexts/ModalProvider'
import { UserService } from '@/services/client/User.service'
import { utils } from '@/utils/utils'

const useLogout = () => {
  // States
  const modalContext = useModal()

  // Hooks
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleUserLogout = async (bypass = false) => {
    if (!bypass) {
      return modalContext.openModal({
        type: 'alert',
        props: {
          maxWidth: 'xs',
          heading: 'Alert',
          description: 'Are you sure you want to logout?',
          onOkClick: async () => {
            await handleUserLogout(true)
          },
          visible: true,
          status: 'idle',
          okButtonText: 'Yes'
        }
      })
    }

    try {
      const us = new UserService()

      try {
        await us.logout()
      } catch (_) {}

      await signOut({
        redirect: false
      })

      dispatch(userActions.resetUser())
      router.push('/login')
    } catch (error) {
      utils.toast.error({
        message: utils.error.getMessage(error)
      })
    }
  }

  return { handleUserLogout }
}

export default useLogout
