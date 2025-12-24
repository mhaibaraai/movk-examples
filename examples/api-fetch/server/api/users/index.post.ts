export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  await new Promise(resolve => setTimeout(resolve, 800))

  return {
    code: 0,
    message: 'User created successfully',
    data: {
      id: Math.floor(Math.random() * 1000),
      ...body,
      createdAt: new Date().toISOString()
    }
  }
})
