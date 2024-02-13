<script setup lang="ts">
const CMSStore = useCMSStore();
// const init = ref(false)
// init({{ images| tojson | safe }});
// animate();
// const anim = () => galleryInit(CMSStore.galleryData.media.map(x => ({imgix_url: `${x.imgix_url}?w=720`, original_name: x.original_name} as media)), canvas.value);
onMounted(async() => {
  // document.body.style.overflow = 'hidden'
  // if (CMSStore.galleryData) {
  //   anim()
  //   init.value = true;
  // }
  // galleryInit(CMSStore.galleryData.media.map(x => ({ imgix_url: `${x.imgix_url}?w=720&fm=webp`, original_name: x.original_name } as media)), canvas.value);
  // CMSStore.$subscribe(() => {
  //   if (!CMSStore.galleryData || init.value) return;
  //   anim()
  //   init.value = true;
  // })
})

  onUnmounted(() => {
    // document.body.style.overflow = 'initial'
  })
</script>

<template>
  <section class="md:ml-[100px] min-h-screen pt-24 md:pt-0">
    <!-- <div class="bg-warm-200 relative z-10 w-max"> -->
    <h1 class="text-center md:text-left text-5xl md:text-9xl px-4 py-4 md:px-12 md:py-8 relative z-10">Gallery</h1>
    <!-- </div> -->
      <masonry-wall class="px-4 md:px-12" :items="CMSStore.galleryData.media" :ssr-columns="1" :column-width="[300, 400, 400]" :gap="16">
      <template #default="{ item, index }">
        <div class="relative group hover:scale-125 transition-transform hover:z-10">
          <div v-if="item.metadata" class="absolute text-white text-xs bg-gradient-to-b from-transparent to-black z-10 w-full bottom-0 h-24 p-2 flex items-end transition-opacity duration-700 opacity-0 group-hover:opacity-100">{{ item.metadata.name }}</div>
          <NuxtPicture provider="imgix" densities="x1 x2" sizes="400px" :src="item.imgix_url.replace('https://imgix.cosmicjs.com', '')" />
        </div>
      </template>
    </masonry-wall>
    <!-- <div ref="canvas" class="bgRenderer absolute w-full h-full -z-0 top-0 right-0 bg-warm-200" /> -->
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
