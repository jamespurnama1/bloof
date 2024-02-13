import FloatingVue from 'floating-vue';


export default defineNuxtPlugin(() => {
  FloatingVue.options.themes.grid= {
    '$extend': 'dropdown',
    autoHide: true,
    preventOverflow: false,
    autoSize: 'max',
  }
})
