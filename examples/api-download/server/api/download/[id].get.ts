export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const files = [
    { id: '1', name: 'document.pdf', size: 2048576, type: 'application/pdf' },
    { id: '2', name: 'image.png', size: 512000, type: 'image/png' },
    { id: '3', name: 'data.json', size: 102400, type: 'application/json' }
  ]

  const file = files.find(f => f.id === id)

  if (!file) {
    throw createError({
      statusCode: 404,
      message: 'File not found'
    })
  }

  const chunkSize = Math.ceil(file.size / 10)
  const totalChunks = 10

  for (let i = 0; i < totalChunks; i++) {
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  const content = new Uint8Array(file.size)
  const blob = new Blob([content], { type: file.type })

  setHeader(event, 'Content-Type', file.type)
  setHeader(event, 'Content-Disposition', `attachment; filename="${file.name}"`)
  setHeader(event, 'Content-Length', file.size.toString())

  return blob
})
