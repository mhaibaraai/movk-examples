// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@movk/nuxt'
  ],

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://emplegnku6.apifox.cn',
      defaultEmail: process.env.NUXT_PUBLIC_DEFAULT_EMAIL || 'admin@movk.com',
      defaultPassword: process.env.NUXT_PUBLIC_DEFAULT_PASSWORD || 'Admin@2025#Secure'
    }
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { ssr: false }
  },

  compatibilityDate: 'latest'
})
