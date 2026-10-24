<template>
  <main v-if="!projectConfigured" class="studio-setup">
    <h1>Connect Sanity Studio</h1>
    <p>Set <code>SANITY_PROJECT_ID</code> and <code>SANITY_DATASET</code> in your environment, then restart the app.</p>
  </main>
  <div v-else ref="studioElement" class="studio-root" />
</template>

<script setup lang="ts">
import type { Root } from 'react-dom/client'

const studioElement = ref<HTMLElement | null>(null)
const sanityClientConfig = useSanity().client.config()
const projectConfigured = sanityClientConfig.projectId !== 'yourProjectId'
let root: Root | undefined

onMounted(async () => {
  if (!projectConfigured) return

  const [{ createRoot }, { createElement }, { Studio }, { default: config }] = await Promise.all([
    import('react-dom/client'),
    import('react'),
    import('sanity'),
    import('../sanity.config'),
  ])

  if (!studioElement.value) return
  root = createRoot(studioElement.value)
  root.render(createElement(Studio, {
    config: {
      ...config,
      projectId: sanityClientConfig.projectId,
      dataset: sanityClientConfig.dataset,
    },
  }))
})

onBeforeUnmount(() => root?.unmount())
</script>

<style>
html,
body,
#__nuxt {
  height: 100%;
  margin: 0;
}

.studio-root {
  position: fixed;
  inset: 0;
  z-index: 1000;
  height: 100dvh;
}

.studio-setup {
  display: grid;
  min-height: 100dvh;
  place-content: center;
  gap: 12px;
  padding: 24px;
  color: #1b1b1b;
  background: #f5f5f5;
  font: 16px/1.5 sans-serif;
}

.studio-setup h1,
.studio-setup p {
  margin: 0;
}
</style>