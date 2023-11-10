import { defineNuxtConfig } from 'nuxt/config'

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
    name: '404',
    path: '/404',
  },
]

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      ESB_TOKEN: process.env.ESB_TOKEN,
      ESB_URL: process.env.ESB_URL,
    },
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
    CONTENTFUL_PREVIEW_ACCESS_TOKEN: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  },
  app: {
    head: {
      link: [
        {rel: "apple-touch-icon", sizes:"180x180", href:"/apple-touch-icon.png"},
        {rel: "icon", type:"image/png", sizes:"32x32", href: "/favicon-32x32.png"},
        {rel: "icon", type:"image/png", sizes:"16x16", href: "/favicon-16x16.png"},
        {rel: "manifest", href: "/site.webmanifest"},
        {rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5"}],
      meta: [
        {name: "msapplication-TileColor", content:"#00aba9"},
        {name: "theme-color", content:"#ffffff"}
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
})
