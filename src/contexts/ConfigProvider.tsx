'use client'

import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react'

import Loader from '@/components/Loader'

import { IInitialRolePermissionSliceState } from '@/store/types'

import { IRole } from '@/models/role.model'
import { ConfigService } from '@/services/client/Config.service'

import { useAuthProviderContext } from './AuthProvider'

export type IConfigProviderContext = {
  loading: boolean
  permissions: IPermissions
  roles: IRole[]
  rolesMap: Map<IRole['_id'], string>
}

type IConfigProviderProps = PropsWithChildren & {}

type IPermissions = IInitialRolePermissionSliceState['data']['permissions']

const ConfigProviderContext = createContext<IConfigProviderContext>({
  loading: true,
  roles: [],
  permissions: {},
  rolesMap: new Map()
})

const useConfigProviderContext = () => useContext(ConfigProviderContext)

const ConfigProvider = (props: IConfigProviderProps) => {
  // States
  const [loading, setLoading] = useState(true)
  const [roles, setRoles] = useState<IConfigProviderContext['roles']>([])
  const rolesMap = useRef<IConfigProviderContext['rolesMap']>(new Map())
  const [permissions, setPermissions] = useState<IConfigProviderContext['permissions']>({})

  // Hooks
  const authContext = useAuthProviderContext()

  // Functions

  const loadConfig = useCallback(async () => {
    try {
      const cs = new ConfigService()
      const config = await cs.get()
      const roles: IRole[] = config.data?.roles ?? []
      rolesMap.current = new Map(roles.map(role => [role._id, role.name]))
      setPermissions(config.data?.permissions ?? {})
      setRoles(config.data?.roles ?? [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authContext.loading) {
      return
    } else {
      if (!authContext.userType) {
        setLoading(false)
        return
      }
    }
    loadConfig()
  }, [loadConfig, setLoading, authContext.loading, authContext.userType])

  const getChildren = (loading: boolean) => {
    if (loading) {
      return null
      //   return <main className='hidden'>{props.children}</main>
    } else {
      return props.children
    }
  }

  return (
    <ConfigProviderContext.Provider value={{ loading, permissions, roles, rolesMap: rolesMap.current }}>
      {loading ? <Loader isPageLoader={true} /> : null}
      {getChildren(loading)}
    </ConfigProviderContext.Provider>
  )
}

export default ConfigProvider

export { useConfigProviderContext }
