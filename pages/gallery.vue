<script setup lang="ts">
const CMSStore = useCMSStore();
const canvas = ref();
// const init = ref(false)
// init({{ images| tojson | safe }});
// animate();
// const anim = () => galleryInit(CMSStore.galleryData.media.map(x => ({imgix_url: `${x.imgix_url}?w=720`, original_name: x.original_name} as media)), canvas.value);
onMounted(async() => {
  document.body.style.overflow = 'hidden'
  // if (CMSStore.galleryData) {
  //   anim()
  //   init.value = true;
  // }
  galleryInit(CMSStore.galleryData.media.map(x => ({ imgix_url: `${x.imgix_url}?w=720`, original_name: x.original_name } as media)), canvas.value);
  // CMSStore.$subscribe(() => {
  //   if (!CMSStore.galleryData || init.value) return;
  //   anim()
  //   init.value = true;
  // })
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

<style lang="scss">
.galleryimg {
  @media (min-width: 768px) {
    min-width: none;
    min-height: none;
  }
  min-width: 48rem;
  height: auto;
}
</style>
