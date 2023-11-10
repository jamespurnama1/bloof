<template>
  <div>
    <h1>{{ route.name }}</h1>
    <client-only>
    <Vue3Lottie
      animationLink="https://assets10.lottiefiles.com/packages/lf20_soCRuE.json"
      :height="200"
      :width="200"
    />
  </client-only>
    <slot />
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
</script>