<script setup lang="ts">
const props = defineProps<{ value?: CmsRichText | null }>()
const { $mdRenderer } = useNuxtApp()
const isPortableText = computed(() => Array.isArray(props.value))
const portableText = computed(() => Array.isArray(props.value) ? props.value : [])
const markdown = computed(() => typeof props.value === 'string' ? $mdRenderer.render(props.value) : '')
</script>

<template>
  <div v-if="isPortableText" class="sanity-rich-text">
    <SanityContent :value="portableText" />
  </div>
  <div v-else-if="markdown" class="sanity-rich-text" v-html="markdown" />
</template>

<style scoped>
.sanity-rich-text :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
}

.sanity-rich-text :deep(a) {
  text-decoration: underline;
}
</style>