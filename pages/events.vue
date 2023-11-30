<script setup lang="ts">
definePageMeta({
  layout: 'sub'
})

const CMSStore = useCMSStore();
</script>

<template>
  <main>
    <section class="flex h-screen bg-warm-200 items-center justify-center">
      <h2 v-html="CMSStore.eventsData.description" class="md:text-7xl text-3xl text-center mx-auto px-5" />
    </section>
    <section class="grid grid-cols-1 md:grid-cols-2">
      <img src="/promo1.jpg" alt="Nighty Night" />
      <img src="/promo2.jpg" alt="Romantic Rooftop" />
    </section>
    <section class="min-h-[50dvh] p-12 flex items-center justify-center flex-col gap-3">
      <h3 class="text-3xl md:text-5xl text-center max-w-xs" v-html="CMSStore.eventsData.call_to_action" />
      <p class="max-w-xs">{{ CMSStore.eventsData.more_description }}</p>
    </section>
    <section class="bg-warm-400 min-h-[50dvh] p-12 flex items-center justify-center">
      <EventForm />
    </section>
  </main>
</template>