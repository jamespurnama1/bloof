<script setup lang="ts">
import { Vue3Lottie, type LottieProps } from 'vue3-lottie';
import super1 from '~/assets/super1.json'
import { useUIStore } from '~/stores/UI'

const lottieAnimation = ref(null) as Ref<null | LottieProps>;
const UIStore = useUIStore();
const loop = ref(true);
const logo = ref(true);
const route = useRoute()
const takingLonger = ref(false);
const { currentRoute } = useRouter();

function loadIn() {
  if (UIStore.loading) return;
  // @ts-ignore
  lottieAnimation.value?.playSegments([300, 360], false);
  loop.value = false;
  logo.value = false
}

UIStore.$subscribe((mutation, state) => {
  loadIn()
})

function onLottieLoop(x: boolean) {
  if (x) return;
  // @ts-ignore
  lottieAnimation.value!.stop();
  UIStore.loadingScreen = false;
}

function onLoad() {
  document.querySelector('.loading svg')?.setAttribute('preserveAspectRatio', 'xMidYMid slice')
  // @ts-ignore
  lottieAnimation.value!.playSegments([0, 300], true)
}

onMounted(async () => {
  setTimeout(() => {
    takingLonger.value = true
  }, 10000)
  await new Promise(resolve => setTimeout(resolve, 10));
  // await nextTick()
  console.log(route.hash)
  if(!route.hash) window.scrollTo(0, 0)
  // await new Promise(resolve => setTimeout(resolve, 100));
  document.querySelector('body')!.style.overflow = 'hidden'
  loadIn()
})

onUnmounted(() => {
  // @ts-ignore
  lottieAnimation.value?.destroy();
  document.querySelector('body')!.style.overflow = 'initial'
})
</script>

<template>
  <div class="fixed top-0 left-0 h-screen w-screen pointer-events-none z-20 flex items-center justify-center">
    <Transition
      class="bottom-0 absolute bg-gradient-to-b to-[rgba(0,0,0,0.8)] from-transparent w-full h-[10%] flex items-center justify-center"
      name="fade">
      <p class="text-white text-center z-10" v-if="takingLonger && UIStore.loading">Loading is taking longer than usual...
      </p>
    </Transition>
    <Transition name="fade">
      <img v-if="currentRoute.path !== '/' && logo" src="/logo.png" alt="Bloof Logo" class="h-72 w-auto absolute z-10" />
    </Transition>
    <Vue3Lottie ref="lottieAnimation" class="loading min-h-full min-w-full overflow-hidden" :animationData="super1"
      :noMargin="true" width="100%" height="100%" :auto-play="false" @on-animation-loaded="onLoad"
      @on-loop-complete="onLottieLoop(loop)" />
  </div>
</template>

<style>
.loading svg {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%
}
</style>
