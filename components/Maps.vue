<template>
  <ClientOnly v-if="CMSStore.landingData">
    <GoogleMap ref="mapRef" :api-key="config.public.GOOGLE_MAPS_API_KEY" class="map w-full h-full" :center="center"
      :zoom="zoom" map-id="73fe9bc0c6b222bf">
      <Marker :marker="location" />
    </GoogleMap>
  </ClientOnly>
</template>

<script setup lang="ts">
import { GoogleMap } from 'vue3-google-map';
const CMSStore = useCMSStore()
const config = useRuntimeConfig();
const mapRef = ref()
const UIStore = useUIStore()

if (process.server && !CMSStore.landingData) {
  const { data: landing } = await useFetch<landingData>(`https://api.cosmicjs.com/v3/buckets/bloof-production/objects/65570bde15339469859176f9?read_key=${process.env.COSMIC_READ_KEY}&depth=1&props=metadata,`);

  if (landing.value) {
    CMSStore.landingData = landing.value;
    UIStore.fetching = false;
  } else {
    throw Error
  }
}

const lat = parseFloat(CMSStore.landingData.object.metadata.location.lat);
const lng = parseFloat(CMSStore.landingData.object.metadata.location.lng);

const location = ref({
  id: 'Bloof',
  headline: 'Bloof Restaurant',
  lat,
  lng
});

const zoom = ref(17);
const center = ref({ lat, lng })

watch(() => mapRef.value?.ready, (ready) => {
  if (!ready) return
  UIStore.maps_loading = false;
})
</script>
