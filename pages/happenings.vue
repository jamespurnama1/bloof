<script setup lang="ts">
definePageMeta({
  layout: 'sub'
})

const UIStore = useUIStore();

onMounted(() => {
  setTimeout(() => {
    UIStore.fetching = false;
  }, 500);
})
</script>

<template>
  <section class="">

  </section>
</template>