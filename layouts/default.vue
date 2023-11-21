<template>
  <slot />
</template>

<script setup lang="ts">
import { useUIStore } from '~/stores/UI'
const UIStore = useUIStore()
</script>
