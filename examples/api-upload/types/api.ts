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

export interface FileUploadResponse {
  id: string
  originalName: string
  storageName: string
  size: number
  contentType: string
  downloadUrl: string
  md5: string
}
