<script setup lang="ts">
useSeoMeta({
  title: 'Bloof',
  ogTitle: 'Bloof',
  description: 'Bloof Bandung.',
  ogDescription: 'Bloof Bandung.',
  ogImage: 'https://bloofbdg.com/cover.jpg',
  twitterCard: 'summary_large_image',
})

const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
const UIStore = useUIStore();
const bottom = ref(false);
const width = ref(0);

function updateWidth() {
  width.value = window.innerWidth;
  UIStore.width = width.value;
};

onMounted(() => {
  document.addEventListener('scroll', () => {
    bottom.value = (window.innerHeight + window.scrollY + 50) >= document.body.offsetHeight;
  });
  window.addEventListener('resize', updateWidth);
  updateWidth();
});
</script>

<template>
  <ClientOnly>
    <loadingScreen v-if="UIStore.loadingScreen" />
  </ClientOnly>
  <NuxtLayout>
    <Cursor v-if="width > 768" />
    <Navigation />
    <NuxtPage />
    <Transition name="fade">
      <aside v-show="bottom" class="fixed right-5 bottom-5 md:right-10 md:bottom-10">
        <button @click="scrollTop()" class="flex items-center justify-center">
          <p class="text-sm md:text-base">Back to top</p>
          <img src="/images/arrow.svg" alt="Arrow Up" aria-label="Arrow-Up"
            class="rotate-180 h-8 md:h-12 w-auto" />
        </button>
      </aside>
    </Transition>
    <footer class="h-64 md:h-[500px] flex items-center justify-center flex-col md:ml-[100px]">
      <img src="/logo.svg" alt="Bloof Logo" class="h-16 md:h-48 w-auto" />
      <h5 class="text-3xl md:text-5xl">Bloof</h5>
      <p class="md:text-xs text-[0.6em]">© 2023 Bloof is part of hemangini Hotel</p>
    </footer>
  </NuxtLayout>
</template>
