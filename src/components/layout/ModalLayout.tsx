'use client';

import { useModal } from '@/contexts/ModalProvider';

import AlertModal from '../modals/AlertModal';
import ForgotPasswordModal from '../modals/ForgotPasswordModal';
import InfoModal from '../modals/InfoModal';
import ManageRoleModal from '../modals/ManageRoleModal';
import ResetPasswordModal from '../modals/ResetPasswordModal';
import UpdatePasswordModal from '../modals/UpdatePasswordModal';

const ModalLayout = () => {
    const modalsContext = useModal();
    const modals = modalsContext.modals;

    return (
        <>
            {modals.alert && <AlertModal />}
            {modals.info && <InfoModal />}
            {modals.forgotPassword && <ForgotPasswordModal />}
            {modals.resetPassword && <ResetPasswordModal />}
            {modals.updatePassword && <UpdatePasswordModal />}
            {modals.manageRoles && <ManageRoleModal />}
        </>
    );
};

export default ModalLayout;
