<script setup lang="ts">
import type { PostHog } from 'posthog-js';

const CMSStore = useCMSStore();
const sel = ref('food')
const hint = ref(true);
let posthog = null as null | PostHog

function flip(direction: string, type: string) {
  if (posthog) posthog.capture('reserve', {
    direction,
    type
  })
  hint.value = false
}


onMounted(() => {
    const { $posthog } = useNuxtApp()
  posthog = $posthog() as PostHog
})
</script>

<template>
  <section class="md:ml-[100px] h-full pt-24 md:pt-0 flex flex-col relative">
    <div class="flex relative gap-2 px-4 py-4 md:px-12 md:py-8 flex-col z-[15]">
      <h1 class="text-center md:text-left text-5xl md:text-7xl xl:text-9xl">Menu</h1>
      <div class="flex justify-center md:justify-start gap-2">
        <button v-if="CMSStore.drinks.length > 1" @click="sel = 'food'"
          class="button_pink small hover:opacity-100" :class="[sel === 'food' ? '' : 'opacity-50']">food</button>
        <button v-if="CMSStore.drinks.length > 1" @click="sel = 'drinks'"
          class="button_teal small hover:opacity-100" :class="[sel === 'drinks' ? '' : 'opacity-50']">drinks</button>
        <button v-else @click="sel = 'food'" class="button_pink small hover:opacity-100"
          :class="[sel === 'food' ? '' : 'opacity-50']">food &amp; drinks</button>
        <button v-if="CMSStore.breakfast.length > 1" @click="sel = 'breakfast'"
          class="button_yellow small hover:opacity-100"
          :class="[sel === 'breakfast' ? '' : 'opacity-50']">brunch</button>
      </div>
      <p class="md:text-base text-xs text-center md:text-start">Click on menu to zoom in &amp; out.</p>
    </div>
    <div class="invisible">
    </div>
    <Transition name="fade">
      <div v-if="hint"
        class="hint pt-60 md:pt-48 xl:pt-60 left-0 top-0 w-full h-full absolute bg-warm-200 bg-opacity-75 flex items-center justify-center z-10 pointer-events-none">
        <figure class="flex flex-col items-center justify-center">
          <img src="/images/arrow.png" alt="Swipe right" class="rotate-90 h-32 md:h-64 w-auto" />
          <figcaption class="font-semibold text-lg md:text-3xl text-center">Swipe to browse the menu.</figcaption>
        </figure>
      </div>
    </Transition>
    <ClientOnly v-if="CMSStore.drinks.length && CMSStore.food.length && CMSStore.breakfast.length">
      <flipbook @flip-left-start="flip('backwards', 'food')" @flip-right-start="flip('forwards', 'food')"
        :zooms="[1, 2]" :nPolygons="20" class="flipbook w-full px-12 self-center absolute transition-opacity top-64"
        :class="[sel === 'food' ? 'opacity-100' : 'opacity-0 pointer-events-none']" :pages="CMSStore.food"
        :pagesHiRes="CMSStore.food_highres"></flipbook>
      <flipbook @flip-left-start="flip('backwards', 'drinks')" @flip-right-start="flip('forwards', 'drinks')"
        :zooms="[1, 2]" :nPolygons="20" class="flipbook w-full px-12 self-center absolute transition-opacity top-64"
        :class="[sel === 'drinks' ? 'opacity-100' : 'opacity-0 pointer-events-none']" :pages="CMSStore.drinks"
        :pagesHiRes="CMSStore.drinks_highres"></flipbook>
      <flipbook @flip-left-start="flip('backwards', 'breakfast')" @flip-right-start="flip('forwards', 'breakfast')"
        :zooms="[1, 2]" :nPolygons="20" class="flipbook w-full px-12 self-center absolute transition-opacity top-64"
        :class="[sel === 'breakfast' ? 'opacity-100' : 'opacity-0 pointer-events-none']" :pages="CMSStore.breakfast"
        :pagesHiRes="CMSStore.breakfast_highres"></flipbook>
    </ClientOnly>
  </section>
</template>

<style lang="scss" scoped>
.flipbook,
.invisible {
  @media (min-width: 768px) {
    height: calc((25.5 * (100vw)) / 36);
  }

  height: calc((25.5 * (90vw)) / 18);
}
</style>
