export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session.user) {
    return {
      code: 401,
      message: 'Unauthorized',
      data: null
    }
  }

  await new Promise(resolve => setTimeout(resolve, 500))

  return {
    code: 0,
    message: 'success',
    data: {
      ...session.user,
      bio: 'A passionate developer',
      joinedAt: '2024-01-01',
      lastLogin: new Date().toISOString()
    }
  }
})
