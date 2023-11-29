<script setup lang="ts">
definePageMeta({
  layout: 'sub'
})
const UIStore = useUIStore();

onMounted(async() => {
  await nextTick()
    UIStore.fetching = false;
})
</script>

<template>
  <section></section>
</template>