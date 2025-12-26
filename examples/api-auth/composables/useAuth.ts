import type { ApiResponse, LoginRequest, AuthTokens, UserInfo } from '~/types/api'

const TOKEN_KEY = 'auth_token'

export function useAuth() {
  const config = useRuntimeConfig()
  const token = useState<string | null>('auth_token', () => null)
  const user = useState<UserInfo | null>('auth_user', () => null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function login(credentials: LoginRequest) {
    try {
      const response = await $fetch<ApiResponse<AuthTokens>>('/api/auth/login', {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        body: credentials
      })

      if (response.code === 0 && response.data) {
        token.value = response.data.accessToken

        if (import.meta.client) {
          localStorage.setItem(TOKEN_KEY, response.data.accessToken)
        }

        await fetchUserInfo()

        return response.data
      } else {
        throw new Error(response.message || '登录失败')
      }
    } catch (error: any) {
      token.value = null
      user.value = null
      throw error
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await $fetch('/api/auth/logout', {
          baseURL: config.public.apiBaseUrl,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      token.value = null
      user.value = null

      if (import.meta.client) {
        localStorage.removeItem(TOKEN_KEY)
      }
    }
  }

  async function fetchUserInfo() {
    if (!token.value) {
      return null
    }

    try {
      const response = await $fetch<ApiResponse<UserInfo>>('/api/auth/userinfo', {
        baseURL: config.public.apiBaseUrl,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      if (response.code === 0 && response.data) {
        user.value = response.data
        return response.data
      } else {
        throw new Error(response.message || '获取用户信息失败')
      }
    } catch (error) {
      console.error('Fetch user info error:', error)
      token.value = null
      user.value = null

      if (import.meta.client) {
        localStorage.removeItem(TOKEN_KEY)
      }

      throw error
    }
  }

  async function initAuth() {
    if (import.meta.client) {
      const savedToken = localStorage.getItem(TOKEN_KEY)
      if (savedToken) {
        token.value = savedToken
        try {
          await fetchUserInfo()
        } catch (error) {
          console.error('Init auth error:', error)
          token.value = null
          user.value = null
          localStorage.removeItem(TOKEN_KEY)
        }
      }
    }
  }

  return {
    token: readonly(token),
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
    fetchUserInfo,
    initAuth
  }
}
