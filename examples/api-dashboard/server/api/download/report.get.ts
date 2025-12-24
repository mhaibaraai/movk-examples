export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const totalChunks = 10
  for (let i = 0; i < totalChunks; i++) {
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  const content = new Uint8Array(1024000)
  const blob = new Blob([content], { type: 'application/pdf' })

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', 'attachment; filename="report.pdf"')
  setHeader(event, 'Content-Length', '1024000')

  return blob
})
