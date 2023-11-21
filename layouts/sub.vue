<template>
  <div class="md:ml-[100px]">
    <section class="flex flex-col gap-12 h-[100dvh] pt-24">
    <h1 v-if="route.name" class="md:px-10 text-7xl md:text-9xl text-center md:text-left">{{ route.name?.toString().charAt(0).toUpperCase() + route.name?.toString().slice(1) }}</h1>
    <ClientOnly v-if="route.path === '/happenings'">
      <Vue3Lottie class="sub" ref="lottieAnimation" :animationData="super1" :auto-play="false" @on-animation-loaded="onLoad" />
    </ClientOnly>
    <img v-else-if="route.path === '/contact'" class="w-full object-cover h-2/3 absolute bottom-0 right-0" src="@/assets/images/super3.svg" alt="Bloof Pattern" />
    <img v-else-if="route.path === '/events'" class="w-full object-cover h-2/3 absolute bottom-0 right-0" src="@/assets/images/super4.svg" alt="Bloof Pattern" />
    </section>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { useUIStore } from '~/stores/UI';
const UIStore = useUIStore();
const route = useRoute();
const lottieAnimation = ref();
import super1 from '~/assets/super1.json';

function onLoad() {
  document.querySelector('.sub svg')?.setAttribute('preserveAspectRatio', 'xMidYMid slice')
  // @ts-ignore
  lottieAnimation.value!.playSegments([0, 300], true)
}
</script>