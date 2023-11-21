<script setup lang="ts">
const CMSStore = useCMSStore();
const UIStore = useUIStore();
const pdf = ref();

if (process.server) {
  pdf.value = await useFetch(`https://api.cosmicjs.com/v3/buckets/bloof-production/objects/65570c4515339469859176fb?read_key=?read_key=${process.env.COSMIC_READ_KEY}&depth=1&props=metadata`, {
    transform: (ReceivedData: menuData) => {
      return ReceivedData.object.metadata
    }
  })

  if (pdf.value) {
    CMSStore.menuData = pdf.value;
  } else {
    throw Error
  }
}
// const props = withDefaults(
//   defineProps<{
//     url?: string;
//     scale?: number;
//   }>(),
//   {}
// );

// const { $usePDF } = useNuxtApp();
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

onMounted(() =>{
  setTimeout(() => {
    UIStore.fetching = false;
  }, 500);
})
</script>

<template>
  <section class="md:ml-[100px] pt-24 md:pt-0">
    <h1 class="text-7xl md:text-9xl px-4 py-4 md:px-12 md:py-8">Menu</h1>
    <img class="w-full h-auto object-cover" src="/menu.jpg" alt="menu">
  <!-- <ClientOnly>
    <VuePDF :pdf="pdf" />
  </ClientOnly> -->
  </section>
</template>
