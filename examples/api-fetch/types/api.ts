export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  traceId?: string
  timestamp?: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface UserInfo {
  id: string
  username: string
  nickname: string
  email: string
  phone: string
  gender: 'UNKNOWN' | 'MALE' | 'FEMALE'
  avatar: string
  status: 'ACTIVE' | 'DISABLED' | 'LOCKED' | 'DELETED'
  deptId: string
  deptName: string
  loginIp: string
  loginDate: string
  remark: string
  createdAt: string
  updatedAt: string
}

export interface PageResponse<T> {
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  numberOfElements: number
  size: number
  content: T[]
  number: number
  empty: boolean
}

export interface UserPageQuery {
  username?: string
  nickname?: string
  phone?: string
  email?: string
  status?: 'ACTIVE' | 'DISABLED' | 'LOCKED' | 'DELETED'
  deptId?: string
  createdAtStart?: string
  createdAtEnd?: string
  page?: number
  size?: number
  sort?: string[]
}
