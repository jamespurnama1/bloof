import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'
import { ofetch } from 'ofetch'

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

const happenings = async () => {
  const response: happeningsData = await ofetch(`https://api.cosmicjs.com/v3/buckets/bloof-production/objects?pretty=true&query=%7B%22type%22:%22happenings%22%7D&read_key=${process.env.COSMIC_READ_KEY}&depth=1&props=slug`);
  return response.objects.map(x => `/happenings/${x.slug}`)
}

export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV !== 'production' ? true : false },
  experimental: {
    renderJsonPayloads: false
  },
  ssr: true,
  site: {
    url: 'https://bloofbdg.com',
  },
  sitemap: {
    sources: [
      '/api/__sitemap__/urls',
    ]
  },
  modules: ['@pinia/nuxt', '@nuxt/image', '@samk-dev/nuxt-vcalendar', 'nuxt-simple-sitemap', 'nuxt-vuefire'],
  css: ['~/assets/css/main.scss'],
  postcss: {
    plugins: {
      'postcss-import': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vuefire: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    },
    appCheck: {
      // Allows you to use a debug token in development
      debug: process.env.NODE_ENV !== 'production',
      isTokenAutoRefreshEnabled: true,
      provider: 'ReCaptchaV3',
      // Find the instructions in the Firebase documentation, link above
      key: process.env.RECAPTCHA_SITE_KEY,
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
      ESB_BRANCH_CODE: process.env.ESB_BRANCH_CODE,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
      POSTHOG_KEY: process.env.POSTHOG_KEY,
      POSTHOG_URL: process.env.POSTHOG_URL
    },
    COSMIC_READ_KEY: process.env.COSMIC_READ_KEY,
    GMAIL_SEND: process.env.GMAIL_SEND,
    GMAIL_RECEIVE: process.env.GMAIL_RECEIVE,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
  },
  app: {
    // pageTransition: { name: 'fade', mode: 'out-in' },
    head: {
      title: "Bloof Bandung Rooftop Restaurant",
      link: [
        {rel: "apple-touch-icon", sizes:"180x180", href:"/apple-touch-icon.png"},
        {rel: "icon", type:"image/png", sizes:"32x32", href: "/favicon-32x32.png"},
        {rel: "icon", type:"image/png", sizes:"16x16", href: "/favicon-16x16.png"},
        {rel: "manifest", href: "/site.webmanifest", crossorigin:"use-credentials"},
        {rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5"}],
      meta: [
        {name: "msapplication-TileColor", content:"#b6dfd8"},
        {name: "theme-color", content:"#faf9f8"},
		    {name: "description", content: "Perched atop Hemangini Hotel, Bloof is a rooftop haven boasting stunning skyline views and an innovative cocktail program. Discover an enchanting blend of indoor-outdoor spaces adorned by a sculptural bar, seamlessly merging sophistication with a magnetic ambiance."},
        {property:"og:title", content:"Bloof Bandung Restaurant"},
		    {property: "og:site_name", content: "Bloof Bandung Restaurant"},
		    {property: "og:url", content: "https://bloofbdg.com"},
		    {property: "og:description", content: "Perched atop Hemangini Hotel, Bloof is a rooftop haven boasting stunning skyline views and an innovative cocktail program. Discover an enchanting blend of indoor-outdoor spaces adorned by a sculptural bar, seamlessly merging sophistication with a magnetic ambiance."},
		    {property: "og:type", content: "restaurant"},
		    {property: "og:image", content: "https://bloofbdg.com/og.jpg"},
		    {name: "twitter:card", content: "summary_large_image"},
		    {name: "twitter:title", content: "Bloof Bandung Restaurant"},
		    {name: "twitter:description", content: "Perched atop Hemangini Hotel, Bloof is a rooftop haven boasting stunning skyline views and an innovative cocktail program. Discover an enchanting blend of indoor-outdoor spaces adorned by a sculptural bar, seamlessly merging sophistication with a magnetic ambiance."},
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
    },
    async 'nitro:config'(nitroConfig) {
      // if (nitroConfig.dev || !nitroConfig.prerender || !nitroConfig.prerender.routes) { return }
      if (process.argv?.includes('generate')) {
      const happeningsSlug = await happenings();
      nitroConfig.prerender!.routes!.push(...happeningsSlug);
      }
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
  },
})
