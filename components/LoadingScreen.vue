<script setup lang="ts">
import type { Rive as RiveType } from '@rive-app/canvas-lite';
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
  window.removeEventListener('resize', resize)
  loop.value = false;
  logo.value = false
}

UIStore.$subscribe((mutation, state) => {
  loadIn()
})

function resize() {
  if(!riveInstance) return;
  riveInstance.resizeDrawingSurfaceToCanvas()
}

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
      resize()
      window.addEventListener('resize', resize)
      // Get the inputs via the name of the state machine
      setTimeout(() => {
        loadIn();
      }, 3000)
    },
    onStateChange: (e) => {
      if (!loop.value && (e.data as string[])[0] === 'exit') {
        UIStore.loadingScreen = false;
      }
    }
  })

  setTimeout(() => {
    takingLonger.value = true
  }, 10000)
  await new Promise(resolve => setTimeout(resolve, 10));
  if (!route.hash) window.scrollTo(0, 0)
  document.querySelector('body')!.style.overflow = 'hidden'
  loadIn()
})

onUnmounted(() => {
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
      <NuxtPicture v-if="currentRoute.path !== '/' && logo" src="/logo.png" alt="Bloof Logo" densities="x1 x2"
        class="h-48 md:h-72 w-auto absolute z-10" sizes="144px md:288px" />
    </Transition>
    <canvas ref="canvas" class="w-full h-full" />
  </div>
</template>

<style></style>
