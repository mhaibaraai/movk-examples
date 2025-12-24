export default defineEventHandler(async (event) => {
  await clearUserSession(event)

  return {
    code: 0,
    message: 'Logout successful',
    data: null
  }
})
