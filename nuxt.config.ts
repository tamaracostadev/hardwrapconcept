// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
      '@nuxtjs/web-vitals',
      '@hypernym/nuxt-anime',
      '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts'
  ],
  googleFonts: {
    families: {
      Philosopher: true,
      Montserrat: true,
    },
    display: 'swap',
    prefetch: true,
    preconnect: true,
    preload: true,
  },
})
