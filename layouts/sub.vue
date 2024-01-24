<template>
  <div class="">
    <section class="flex flex-col gap-12 h-[100dvh] pt-24 md:ml-[100px] relative">
      <h1 v-if="route.name" class="md:px-10 text-5xl md:text-7xl xl:text-9xl text-center md:text-left">{{
        route.name?.toString().charAt(0).toUpperCase() + route.name?.toString().slice(1) }}</h1>
      <ClientOnly v-if="route.path === '/happenings'">
        <dotlottie-player class="sub" preserveAspectRatio="xMidYMid slice" :segment="[0, 300]" ref="lottieAnimation" src="/animations/super1.lottie" />
      </ClientOnly>
      <NuxtPicture class="absolute bottom-0 right-0 overflow-hidden h-2/3 w-full"
        :imgAttrs="{ class: 'pattern3 object-cover absolute top-0 right-0 scale-150 w-full' }"
        :placeholder="[50, 25, 75, 5]" v-else-if="route.path === '/contact'" src="/images/super3.jpg"
        alt="Bloof Pattern" />
      <NuxtPicture class="absolute bottom-0 right-0 overflow-hidden h-2/3 w-full"
        :imgAttrs="{ class: 'object-cover absolute top-0 right-0 scale-150 w-full' }"
        :placeholder="[50, 25, 75, 5]" v-else-if="route.path === '/events'" src="/images/super4.jpg"
        alt="Bloof Pattern" />
    </section>
    <slot />
  </div>
</template>

<script lang="ts" setup>
const { $gsap: gsap } = useNuxtApp();
const route = useRoute();
const lottieAnimation = ref();
const ctx = ref();

onMounted(() => {
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
</script>