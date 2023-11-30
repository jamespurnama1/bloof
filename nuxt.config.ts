import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'

export const routes = [
  {
    name: 'home',
    path: '/',
  },
  {
    name: 'events',
    path: '/events',
  },
  {
    name: 'gallery',
    path: '/gallery',
  },
  {
    name: 'menu',
    path: '/menu',
  },
  {
    name: 'contact',
    path: '/contact',
  },
  {
    name: 'happenings',
    path: '/happenings',
  },
  {
    name: [],
    path: '/happenings/[id]'
  },
  {
    name: '404',
    path: '/404',
  },
]

export default defineNuxtConfig({
  devtools: { enabled: true },
  experimental: {
    renderJsonPayloads: false
  },
  ssr: true,
  modules: ['@pinia/nuxt', '@nuxt/image', '@samk-dev/nuxt-vcalendar'],
  css: ['~/assets/css/main.scss'],
  postcss: {
    plugins: {
      'postcss-import': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
    vue: {  
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('swiper-'),
    },
  },
  runtimeConfig: {
    public: {
      ESB_TOKEN: process.env.ESB_TOKEN,
      ESB_URL: process.env.ESB_URL,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    },
    COSMIC_READ_KEY: process.env.COSMIC_READ_KEY,
  },
  app: {
    // pageTransition: { name: 'fade', mode: 'out-in' },
    head: {
      link: [
        {rel: "apple-touch-icon", sizes:"180x180", href:"/apple-touch-icon.png"},
        {rel: "icon", type:"image/png", sizes:"32x32", href: "/favicon-32x32.png"},
        {rel: "icon", type:"image/png", sizes:"16x16", href: "/favicon-16x16.png"},
        {rel: "manifest", href: "/site.webmanifest", crossorigin:"use-credentials"},
        {rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5"}],
      meta: [
        {name: "msapplication-TileColor", content:"#b6dfd8"},
        {name: "theme-color", content:"#faf9f8"},
        {property:"og:title", content:"Bloof Bandung"},
		    {property: "og:site_name", content: "Bloof Restaurant"},
		    {property: "og:url", content: "https://bloofbdg.com"},
		    {property: "og:description", content: ""},
		    {property: "og:type", content: "restaurant"},
		    {property: "og:image", content: "https://bloofbdg.com/og.jpg"},
		    {name: "twitter:card", content: "summary_large_image"},
		    {name: "twitter:title", content: "Bloof Bandung Restaurant"},
		    {name: "twitter:description", content: ""},
		    {name: "twitter:image", content: "https://bloofbdg.com/twitter.jpg"},
      ]
    }
  },
  hooks: {
    'pages:extend': (pages) => {

      pages.map((page) => {
 
        routes.forEach(route => {
          if (route.name === page.name) {
            Object.assign(page, {path: route.path});
          }
        })
      })
    }
  },
  image: {
   format: ['avif', 'webp', 'jpg'],
     imgix: {
      baseURL: 'https://imgix.cosmicjs.com'
    }
  },
  vite: {
    vue: {
      script: {
        globalTypeFiles: [
          fileURLToPath(new URL('./types/index.d.ts', import.meta.url))
        ]
      }
    }
  }
})
