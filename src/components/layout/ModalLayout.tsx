'use client'

import { useModal } from '@/contexts/ModalProvider'

import AddCardModal from '../modals/AddCardModal'
import AddCustodyModal from '../modals/AddCustodyModal'
import AddProfileModal from '../modals/AddProfileModal'
import AddUserModal from '../modals/AddUserModal'
import AlertModal from '../modals/AlertModal'
import ForgotPasswordModal from '../modals/ForgotPasswordModal'
import InfoModal from '../modals/InfoModal'
import ManageQrsModal from '../modals/ManageQrsModal'
import ManageReportsModal from '../modals/ManageReportsModal'
import ManageRoleModal from '../modals/ManageRoleModal'
import ResetPasswordModal from '../modals/ResetPasswordModal'
import UpdatePasswordModal from '../modals/UpdatePasswordModal'

const ModalLayout = () => {
  const modalsContext = useModal()
  const modals = modalsContext.modals

  return (
    <>
      {modals.alert && <AlertModal />}
      {modals.info && <InfoModal />}
      {modals.forgotPassword && <ForgotPasswordModal />}
      {modals.resetPassword && <ResetPasswordModal />}
      {modals.updatePassword && <UpdatePasswordModal />}
      {modals.addUser && <AddUserModal />}
      {modals.profile && <AddProfileModal />}
      {modals.addCard && <AddCardModal />}
      {modals.addCustody && <AddCustodyModal />}
      {modals.manageQrs && <ManageQrsModal />}
      {modals.manageReports && <ManageReportsModal />}
      {modals.manageRoles && <ManageRoleModal />}
    </>
  )
}

export default ModalLayout
