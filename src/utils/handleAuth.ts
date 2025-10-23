import { http } from './http'

const login = async (data: Record<any, any>) => {
  try {
    const response = await http({
      url: 'auth/login',
      data,
      method: 'POST'
    })

    return response
  } catch (error: any) {
    throw new Error(error?.message)
  }
}

const logout = async () => {}

export { login, logout }
