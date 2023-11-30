// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import { Autoplay } from 'swiper/modules';
// register Swiper custom elements
export default defineNuxtPlugin((nuxtApp) => {
  register();
  return {
        provide: {
            Autoplay
        }
    }
})
