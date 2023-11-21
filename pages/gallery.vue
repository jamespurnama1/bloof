<script setup lang="ts">
const UIStore = useUIStore();

onMounted(() => {
  setTimeout(() => {
    UIStore.fetching = false;
  }, 500);
})
</script>

<template>
  <section class="md:ml-[100px] h-[100dvh] pt-24 md:pt-0">
    <h1 class="text-7xl md:text-9xl px-4 py-4 md:px-12 md:py-8">Gallery</h1>
  </section>
</template>