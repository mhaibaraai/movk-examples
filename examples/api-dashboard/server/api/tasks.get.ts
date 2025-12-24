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
    data: [
      { id: 1, title: 'Review PR', status: 'pending', priority: 'high' },
      { id: 2, title: 'Update docs', status: 'in_progress', priority: 'medium' },
      { id: 3, title: 'Fix bug #123', status: 'completed', priority: 'high' }
    ]
  }
})
