import type { ApiResponse, FileUploadResponse } from '~/types/api'

export function useFileUpload() {
  const config = useRuntimeConfig()
  const { token } = useAuth()

  async function uploadFile(file: File, category?: string, onProgress?: (progress: number) => void) {
    if (!token.value) {
      throw new Error('未登录,无法上传文件')
    }

    const formData = new FormData()
    formData.append('file', file)

    return new Promise<FileUploadResponse>((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100)
          onProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response: ApiResponse<FileUploadResponse> = JSON.parse(xhr.responseText)
            if (response.code === 0 && response.data) {
              resolve(response.data)
            } else {
              reject(new Error(response.message || '上传失败'))
            }
          } catch (error) {
            reject(new Error('解析响应失败'))
          }
        } else {
          reject(new Error(`上传失败: ${xhr.status}`))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('网络错误'))
      })

      xhr.addEventListener('abort', () => {
        reject(new Error('上传已取消'))
      })

      const url = new URL('/api/system/files/upload', config.public.apiBaseUrl)
      if (category) {
        url.searchParams.append('category', category)
      }

      xhr.open('POST', url.toString())
      xhr.setRequestHeader('Authorization', `Bearer ${token.value}`)
      xhr.send(formData)
    })
  }

  return {
    uploadFile
  }
}
