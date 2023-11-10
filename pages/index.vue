<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()

const { data, error, pending, refresh } = await useFetch(`${config.public.ESB_URL}/setting/branch`, {
  headers: {
    Authorization: `Bearer ${config.public.ESB_TOKEN}`,
    'Data-Branch': 'OUTB'
  },
  server: false,
})

await new Promise(resolve => setTimeout(resolve, 30000));

onMounted(() => {
  console.log(data.value)
})
</script>

<template>
  <div>
    <h1 class="">Bloof</h1>
    <p>{{ data }}</p>
  </div>
</template>
