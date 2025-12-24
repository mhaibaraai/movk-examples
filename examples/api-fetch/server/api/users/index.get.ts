export default defineEventHandler(async () => {
  await new Promise(resolve => setTimeout(resolve, 500))

  return {
    code: 0,
    message: 'success',
    data: [
      { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
      { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'user' }
    ]
  }
})
