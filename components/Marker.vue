<template>
  <CustomMarker :options="{ position: { lat: marker.lat, lng: marker.lng }, anchorPoint: 'CENTER' }">
    <img src="/images/marker.svg" width="80" height="80" />
  </CustomMarker>
</template>

<script setup lang="ts">
import { CustomMarker } from 'vue3-google-map';

const props = defineProps({
  marker: {
    type: Object,
    required: true,
  }
});
</script>