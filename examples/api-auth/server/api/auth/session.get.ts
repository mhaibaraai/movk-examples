export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session.user) {
    return {
      code: 401,
      message: 'Not authenticated',
      data: null
    }
  }

  return {
    code: 0,
    message: 'success',
    data: session.user
  }
})
