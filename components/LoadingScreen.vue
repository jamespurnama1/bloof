<script setup lang="ts">
import type { Rive as RiveType, StateMachineInput } from '@rive-app/canvas-lite';
import { useUIStore } from '~/stores/UI'

const { $Rive: Rive, $Fit: Fit, $Layout: Layout } = useNuxtApp();
let riveInstance: RiveType;
const canvas = ref(null) as Ref<null | HTMLCanvasElement>;
const UIStore = useUIStore();
const loop = ref(true);
const logo = ref(true);
const route = useRoute()
const takingLonger = ref(false);
const { currentRoute } = useRouter();

function loadIn() {
  if (UIStore.loading || !riveInstance) return;
  const inputs = riveInstance.stateMachineInputs('Loading');
  if (!inputs) return
  // Find the input you want to set a value for, or trigger
  inputs.forEach(i => {
    const inputName = i.name;
    switch (inputName) {
      case 'Finish':
        i.value = true;
        break;
    }
  })
  // // segment.value = [300, 360]
  // // lottieAnimation.value!.seek(300);
  // // lottieAnimation.value!.setLooping(false);
  loop.value = false;
  setTimeout(() => {
    logo.value = false
  }, 3000);
}

UIStore.$subscribe((mutation, state) => {
  loadIn()
})

onMounted(async () => {
  riveInstance = new Rive({
    canvas: canvas.value as HTMLCanvasElement,
    src: '/animations/bloof.riv',
    autoplay: true,
    stateMachines: 'Loading',
    layout: new Layout({
      fit: Fit.Cover,
    }),
    onLoad: () => {
      riveInstance.resizeDrawingSurfaceToCanvas()
      // Get the inputs via the name of the state machine
      setTimeout(() => {
        loadIn();
      }, 3000)
    },
    onStateChange: (e) => {
      if (!loop.value && (e.data as string[])[0] === 'exit') UIStore.loadingScreen = false;
    }
  })

  setTimeout(() => {
    takingLonger.value = true
  }, 10000)
  await new Promise(resolve => setTimeout(resolve, 10));
  // await nextTick()
  if (!route.hash) window.scrollTo(0, 0)
  // await new Promise(resolve => setTimeout(resolve, 100));
  document.querySelector('body')!.style.overflow = 'hidden'
  loadIn()
})

onUnmounted(() => {
  // @ts-ignore
  // lottieAnimation.value ? lottieAnimation.value.destroy() : null;
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
    <canvas ref="canvas" class="w-full h-full" />
    <!-- <dotlottie-player :key="segment" ref="lottieAnimation" autoplay="true" loop="true" class="loading min-h-full min-w-full overflow-hidden" src="/animations/super1.lottie"
      width="100%" height="100%" :segment="segment" PreserveAspectRatio="xMidYMid slice" @frame="frameCount" @loop="onLottieLoop" /> -->
  </div>
</template>

<style></style>
