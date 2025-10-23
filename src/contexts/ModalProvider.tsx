'use client'

import { createContext, PropsWithChildren, useContext, useRef, useState } from 'react'

import { IModalContext, ModalPropsMap, ModalType } from './types'

const modals_: IModalContext['modals'] = {
  alert: null,
  info: null,
  profile: null,
  addUser: null,
  profiles: null,
  updatePassword: null,
  resetPassword: null,
  forgotPassword: null,
  addCard: null,
  addCustody: null,
  manageQrs: null,
  manageReports: null,
  manageRoles: null
}

export const ModalContext = createContext<IModalContext>({
  modals: modals_,
  openModal: (_: any) => {},
  closeModal: (_: any) => {},
  resetModalsState: () => {}
})

export const useModal = () => useContext(ModalContext)

const ModalProvider = (props: PropsWithChildren) => {
  const modalsRef = useRef(modals_)
  const [modals, setModals] = useState(modals_)

  const openModal = <T extends ModalType>(args: { type: T; props: ModalPropsMap[T] }) => {
    let modals_ = { ...modalsRef.current }
    modals_[args.type] = args.props
    modalsRef.current = modals_
    setModals(modalsRef.current)
  }

  const closeModal = (args: ModalType) => {
    modalsRef.current[args]?.onClose?.()
    let modals_ = { ...modalsRef.current }
    modals_[args] = null
    modalsRef.current = modals_
    setModals(modalsRef.current)
  }

  const resetModalsState = () => {
    modalsRef.current = { ...modals_ }
    setModals(modalsRef.current)
  }

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal, resetModalsState }}>
      {props.children}
    </ModalContext.Provider>
  )
}

export default ModalProvider
