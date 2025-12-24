export default defineEventHandler(async (event) => {
  const form = await readFormData(event)
  const file = form.get('file') as File

  if (!file) {
    return {
      code: 400,
      message: 'No file provided',
      data: null
    }
  }

  const totalChunks = 10
  for (let i = 0; i < totalChunks; i++) {
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  return {
    code: 0,
    message: 'Upload successful',
    data: {
      filename: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    }
  }
})
