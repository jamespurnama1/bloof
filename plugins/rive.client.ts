import { Rive, Layout, Fit } from '@rive-app/canvas-lite'

export default defineNuxtPlugin((nuxtApp) => {

  return {
    provide: {
      Rive,
      Layout,
      Fit
    },
  };
});
