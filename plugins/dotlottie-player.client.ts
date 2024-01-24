import * as LottiePlayer from '@aarsteinmedia/dotlottie-player-light';

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.component('dotlottie-player', LottiePlayer)
})
