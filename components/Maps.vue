<template>
  <ClientOnly>
    <GoogleMap ref="mapRef" :api-key="config.public.GOOGLE_MAPS_API_KEY" class="map w-full h-full"
      :center="{ lat: parseFloat(CMSStore.landingData.location.lat.toString()), lng: parseFloat(CMSStore.landingData.location.lng.toString()) }"
      :zoom="zoom" map-id="73fe9bc0c6b222bf">
      <Marker :marker="{
        id: 'Bloof',
        headline: 'Bloof Restaurant',
        lat: parseFloat(CMSStore.landingData.location.lat.toString()),
  lng: parseFloat(CMSStore.landingData.location.lng.toString())
      }" />
    </GoogleMap>
  </ClientOnly>
</template>

<script setup lang="ts">
import { GoogleMap } from 'vue3-google-map';
const CMSStore = useCMSStore()
const config = useRuntimeConfig();
const mapRef = ref();
const UIStore = useUIStore();
const zoom = ref(17);

watch(() => mapRef.value?.ready, (ready) => {
  if (!ready) return
  UIStore.maps_loading = false;
})
</script>
