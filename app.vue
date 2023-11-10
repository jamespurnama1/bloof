<script setup lang="ts">
useSeoMeta({
  title: 'Bloof',
  ogTitle: 'Bloof',
  description: 'Bloof Bandung.',
  ogDescription: 'Bloof Bandung.',
  ogImage: 'https://bloofbdg.com/cover.jpg',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <Suspense>
    <template #default>
      <NuxtLayout>
        <div>
          <header>
            <Navigation />
          </header>
          <NuxtPage />
        </div>
      </NuxtLayout>
    </template>
    <template #fallback>
      <loadingScreen />
    </template>
  </Suspense>
</template>
