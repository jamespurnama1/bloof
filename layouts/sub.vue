<template>
  <div class="">
    <section class="flex flex-col gap-12 h-[100dvh] pt-24 md:ml-[100px] relative overflow-hidden">
      <h1 v-if="route.name" class="md:px-10 text-5xl md:text-7xl xl:text-9xl text-center md:text-left">{{
        route.name?.toString().charAt(0).toUpperCase() + route.name?.toString().slice(1) }}</h1>
      <canvas v-if="route.path === '/happenings'" ref="canvas" class="w-full h-full" />
      <NuxtPicture class="absolute bottom-0 right-0 overflow-hidden h-2/3 w-full"
        :imgAttrs="{ class: 'pattern3 object-cover absolute top-0 right-0 scale-150 w-full' }"
        :placeholder="[50, 25, 75, 5]" densities="x1 x2" sizes="100vw" v-else-if="route.path === '/contact'" src="/images/super3.jpg"
        alt="Bloof Pattern" />
      <NuxtPicture class="absolute bottom-0 right-0 overflow-hidden h-2/3 w-full"
        :imgAttrs="{ class: 'object-cover absolute top-0 right-0 scale-150 w-full' }" :placeholder="[50, 25, 75, 5]" densities="x1 x2" sizes="100vw"
        v-else-if="route.path === '/events'" src="/images/super4.jpg" alt="Bloof Pattern" />
    </section>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { Rive as RiveType, StateMachineInput } from '@rive-app/canvas-lite';
const { $Rive: Rive, $Fit: Fit, $Layout: Layout } = useNuxtApp();
const { $gsap: gsap } = useNuxtApp();
const route = useRoute();
const ctx = ref();
let riveInstance: RiveType;
const canvas = ref() as Ref<HTMLCanvasElement>;

onMounted(async () => {
  ctx.value = gsap.context((self) => {
    if (route.path === '/contact') {
      //pattern 3
      gsap.to('.pattern3', {
        y: '-=49%',
        repeat: -1,
        duration: 10,
        ease: 'linear'
      })
    }
  })
})

watch(
  () => canvas,
  () => {
    if (route.path === '/happenings') {
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
          window.addEventListener('resize', () => {
            riveInstance.resizeDrawingSurfaceToCanvas()
          })
        }
      })
    }
  },
  { deep: true }
)
</script>