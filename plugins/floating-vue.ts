import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(FloatingVue, {
    themes: {
    'grid': {
      '$extend': 'dropdown',
      autoHide: true,
      preventOverflow: false,
      autoSize: 'max',
    },
  }}
  );
});
