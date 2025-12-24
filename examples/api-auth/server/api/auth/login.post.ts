export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  await new Promise(resolve => setTimeout(resolve, 800))

  if (body.email === 'admin@example.com' && body.password === 'password') {
    await setUserSession(event, {
      user: {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin'
      }
    })

    return {
      code: 0,
      message: 'Login successful',
      data: {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin'
      }
    }
  }

  return {
    code: 401,
    message: 'Invalid credentials',
    data: null
  }
})
