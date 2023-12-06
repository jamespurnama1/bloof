<script setup lang="ts">
import { galleryAnimate } from '~/composables/Gallery';

const CMSStore = useCMSStore();

// init({{ images| tojson | safe }});
// animate();
onMounted(async() => {
  document.body.style.overflow = 'hidden'
  galleryInit(CMSStore.galleryData.media)
  galleryAnimate()
})

  onUnmounted(() => {
    document.body.style.overflow = 'initial'
  })
</script>

<template>
  <section class="md:ml-[100px] h-[100dvh] pt-24 md:pt-0">
    <!-- <div class="bg-warm-200 relative z-10 w-max"> -->
    <h1 class="text-center md:text-left text-5xl md:text-9xl px-4 py-4 md:px-12 md:py-8 relative z-10">Gallery</h1>
    <!-- </div> -->
    <div ref="canvas" class="bgRenderer absolute w-full h-full -z-0 top-0 right-0 bg-warm-200" />
  </section>
</template>

<style scoped>
canvas {
  mask-image: radial-gradient(circle, rgba(255, 255, 255, 1) 35%, rgba(0, 0, 0, 1) 50%);
}
</style>
