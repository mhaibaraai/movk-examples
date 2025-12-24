export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  await new Promise(resolve => setTimeout(resolve, 300))

  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user', status: 'active' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'user', status: 'inactive' }
  ]

  const user = users.find(u => u.id === Number(id))

  if (!user) {
    return {
      code: 404,
      message: 'User not found',
      data: null
    }
  }

  return {
    code: 0,
    message: 'success',
    data: user
  }
})
