import Flipbook from 'flipbook-vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("Flipbook", Flipbook);
});
