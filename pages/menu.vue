<script setup lang="ts">
const CMSStore = useCMSStore();
const sel = ref('food')
const hint = ref(true);

// if (process.server) {
//   CMSStore.getMenuPDF()
// }

// const props = withDefaults(
//   defineProps<{
//     url?: string;
//     scale?: number;
//   }>(),
//   {}
// );

// let pdf = ref();
// let pages = ref(0);
// let info = ref();

// watch(
//   () => props.url,
//   () => {
//     if (!props.url) {
//       return;
//     }
//     const { pdf: _pdf, pages: _pages, info: _info } = $usePDF(props.url, {});
//     pdf = _pdf;
//     pages = _pages;
//     info = _info;
//   },
//   { immediate: true }
// );


onMounted(() => {
  // CMSStore.$subscribe((mutation, state) => {
  //   if (!CMSStore.galleryData) return;
  //   images.value = CMSStore.galleryData.media.map(x => {
  //     return x.imgix_url
  //   })
  // })
})
</script>

<template>
  <Transition name="fade">
    <div v-if="hint"
      class="md:ml-[100px] top-0 left-0 w-full h-full fixed bg-white bg-opacity-75 flex items-center justify-center z-10 pointer-events-none">
      <figure class="flex flex-col items-center justify-center">
        <img src="/images/arrow.png" alt="Swipe right" class="-rotate-90 h-64 w-auto" />
        <figcaption class="font-semibold text-3xl text-center">Swipe to browse the menu.</figcaption>
      </figure>
    </div>
  </Transition>
  <section class="md:ml-[100px] pt-24 md:pt-0 flex flex-col relative">
    <div class="flex gap-2 px-4 py-4 md:px-12 md:py-8 flex-col">
      <h1 class="text-center md:text-left text-5xl md:text-7xl xl:text-9xl">Menu</h1>
      <div class="flex justify-center md:justify-start gap-2">
        <button @click="sel = 'food'" class="button_pink small hover:opacity-100"
          :class="[sel === 'food' ? '' : 'opacity-50']">food</button>
        <button @click="sel = 'drinks'" class="button_teal small hover:opacity-100"
          :class="[sel === 'drinks' ? '' : 'opacity-50']">drinks</button>
      </div>
      <p class="text-xs text-center md:text-start">Click on menu to zoom in &amp; out.</p>
    </div>
    <div class="invisible" />
    <!-- <img class="w-full h-auto object-cover" src="/menu.jpg" alt="menu"> -->
    <ClientOnly v-if="CMSStore.drinks.length && CMSStore.food.length">
      <flipbook @flip-left-start="hint = false" @flip-right-start="hint = false" :zooms="[1, 2]"
        class="flipbook w-full px-12 self-center absolute transition-opacity top-60 md:top-48 xl:top-60"
        :class="[sel === 'food' ? 'opacity-100' : 'opacity-0 pointer-events-none']" :pages="CMSStore.food"
        :pagesHiRes="CMSStore.food_highres"></flipbook>
      <flipbook @flip-left-start="hint = false" @flip-right-start="hint = false" :zooms="[1, 2]"
        class="flipbook w-full px-12 self-center absolute transition-opacity top-60 md:top-48 xl:top-60"
        :class="[sel === 'drinks' ? 'opacity-100' : 'opacity-0 pointer-events-none']" :pages="CMSStore.drinks"
        :pagesHiRes="CMSStore.drinks_highres"></flipbook>
    </ClientOnly>
  </section>
</template>

<style lang="scss" scoped>
.flipbook,
.invisible {
  @media (min-width: 768px) {
    height: calc((25.5 * (100vw - 196px)) / 36);
  }

  height: calc((25.5 * (90vw - 32px)) / 18);
}</style>
