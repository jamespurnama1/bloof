import { defineNuxtPlugin } from '#app'
import posthog from 'posthog-js'
export default defineNuxtPlugin(nuxtApp => {
  const runtimeConfig = useRuntimeConfig();
  const posthogClient = posthog.init(runtimeConfig.public.POSTHOG_KEY, {
    api_host: runtimeConfig.public.POSTHOG_URL,
    loaded: (posthog) => {
      if (import.meta.env.MODE === 'development') posthog.debug();
      if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "[::]") {
        posthog.opt_out_capturing()
      }
    }
  })

  // Make sure that pageviews are captured with each route change
  const router = useRouter();
  router.afterEach((to) => {
    posthog.capture('$pageview', {
      current_url: to.fullPath
    });
  });
  
  return {
    provide: {
      posthog: () => posthogClient
    }
  }
})