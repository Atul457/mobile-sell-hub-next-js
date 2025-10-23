'use client'

import { createContext, PropsWithChildren, ReactNode, useContext, useRef, useState } from 'react'

import { IProfile } from '@/models/profile.model'

type IDataProviderContextState = {
  profile?: IProfile
}

type IDataProviderContext = {
  goBackPostFix: ReactNode | null
  onSearch: ((search: string) => void) | null
  setOnSearchFn: (onSearch: IDataProviderContext['onSearch']) => void
  setGoBackPostFix: (goBackPostFix: ReactNode | null) => void
  state: IDataProviderContextState
  setState: <K extends keyof IDataProviderContext['state']>(data: [K, IDataProviderContext['state'][K]]) => void
}

type IDataProviderProps = PropsWithChildren & {}

const DataProviderContext = createContext<IDataProviderContext>({
  goBackPostFix: null,
  onSearch: null,
  setOnSearchFn: () => {},
  setGoBackPostFix: () => {},
  state: {},
  setState: () => {}
})

const useDataProviderContext = () => useContext(DataProviderContext)

const DataProvider = (props: IDataProviderProps) => {
  // States
  const [render, setRender] = useState(false)

  const state = useRef<IDataProviderContextState>({})
  const onSearchRef = useRef<IDataProviderContext['onSearch']>(null)
  const goBackPostFix = useRef<IDataProviderContext['goBackPostFix']>(null)

  // Functions
  const setOnSearchFn = (onSearch: IDataProviderContext['onSearch']) => {
    setRender(!render)
    onSearchRef.current = onSearch
  }

  const setGoBackPostFix = (postFix: IDataProviderContext['goBackPostFix']) => {
    setRender(!render)
    goBackPostFix.current = postFix
  }

  const setState: IDataProviderContext['setState'] = data => {
    const [key, value] = data
    state.current = {
      ...state.current,
      [key]: value
    }
    setRender(!render)
  }

  return (
    <DataProviderContext.Provider
      value={{
        onSearch: onSearchRef.current,
        setOnSearchFn,
        setState,
        setGoBackPostFix,
        goBackPostFix: goBackPostFix.current,
        state: state.current
      }}
    >
      {props.children}
    </DataProviderContext.Provider>
  )
}

export default DataProvider

export { useDataProviderContext }
