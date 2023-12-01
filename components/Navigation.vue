<template>
  <!-- Desktop -->
  <div v-if="UIStore.width >= 768" class="h-full fixed transition-colors" @mouseenter="showNav = true"
    @mouseleave="showNav = false" @click="showFullNav = !showFullNav"
    :class="[showFullNav ? 'z-30 -translate-x-0 bg-white opacity-30 w-full' : 'w-2/3 z-50 -translate-x-[calc(66.666667vw-100px)] bg-transparent']" />
  <nav v-if="UIStore.width >= 768"
    :class="[nav && !showFullNav ? '!-translate-x-[calc(66.666667vw-100px)]' : '', showFullNav ? '!translate-x-0' : '']"
    class="outline-[5px] outline outline-black fixed w-2/3 h-[100dvh] z-40 left-0 top-0 bg-teal-600 transition ease-in-out -translate-x-full duration-500 flex justify-center"
    @click="showFullNav = !showFullNav">
    <TransitionGroup tag="ul" mode="out-in" :css="false" @enter="onEnter" @leave="onLeave" name="slideLeft"
      class="m-5 flex items-start justify-center flex-col gap-6">
      <li v-for="(value, key, index) in items" v-show="showFullNav"
        class="text-5xl xl:text-7xl font-bold font-serif -translate-x-full opacity-0" :data-index="index" :key="index">
        <NuxtLink :to="value">{{ key }}</NuxtLink>
      </li>
      <li :key="Object.keys(items).length + 1">
        <NuxtLink to="/" aria-label="Home" class="">
          <img src="/logo.svg" alt="Bloof Logo" class="transition h-24 w-auto object-contain"
            :class="[showFullNav ? '' : 'opacity-0']" />
          <p class="font-bold font-serif text-xl text-center">Bloof</p>
        </NuxtLink>
      </li>
    </TransitionGroup>
    <button aria-label="Open Navigation" class="absolute right-[35px] top-1/2">
      <img src="/images/caret.svg" alt="Navigation Arrow" class="transition h-7 w-auto object-cover"
        :class="[showFullNav ? 'rotate-180' : '']" />
    </button>
    <NuxtLink @click="showFullNav = false" to="/" aria-label="Home" class="absolute right-[25px] bottom-5"
      :class="[showFullNav ? 'opacity-0' : '']">
      <img src="/logo.svg" alt="Bloof Logo" class="transition h-20 w-auto object-contain" />
      <p class="font-bold font-serif text-xl text-center">Bloof</p>
    </NuxtLink>
  </nav>

  <!-- Mobile -->
  <nav v-else-if="!UIStore.loadingScreen"
    class="fixed z-40 top-0 h-16 w-full bg-teal-600 py-2 px-4 flex justify-between items-center transition-all outline-4 outline" :class="showFullNav ? 'outline-transparent' : 'outline-black'">
    <NuxtLink @click="showFullNav = false" to="/" class="h-full"><img src="/logo.svg" alt="Bloof Logo"
        class="object-contain h-full w-auto" /></NuxtLink>
    <NuxtLink @click="showFullNav = false" to="/" class="font-bold font-serif text-xl">Bloof</NuxtLink>
    <button aria-label="Open Navigation" @click="showFullNav = !showFullNav">
      <img src="/images/caret.svg" alt="Navigation Arrow" class="transition h-5 w-auto object-contain"
        :class="[showFullNav ? '-rotate-90' : 'rotate-90']" />
    </button>
    <div class="h-full bg-teal-600 w-full fixed top-0 left-0 transition duration-500 -z-10"
      :class="showFullNav ? '' : '-translate-y-full'">
      <TransitionGroup tag="ul" mode="out-in" :css="false" @enter="onEnter" @leave="onLeave" name="slideLeft"
        class="m-5 h-full flex items-start justify-center flex-col gap-6 z-10 relative">
        <li v-for="(value, key, index) in items" v-show="showFullNav" @click="showFullNav = false;"
          class="text-5xl font-bold font-serif -translate-x-full opacity-0" :data-index="index" :key="index">
          <NuxtLink @click="showFullNav = false" :to="value">{{ key }}</NuxtLink>
        </li>
      </TransitionGroup>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useUIStore } from '~/stores/UI'

const showNav = ref(false);
const showFullNav = ref(false);
const main = ref();
const ctx = ref();
const { $gsap: gsap } = useNuxtApp();
const UIStore = useUIStore();

const items = {
  Happenings: '/happenings',
  "Contact Us": '/contact',
  Menu: '/menu',
  Gallery: '/gallery',
  Events: '/events',
}

const nav = computed(() => showNav.value || UIStore.nav)

function onEnter(el: Element, done: () => void) {
  ctx.value = gsap.context((self) => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      // stagger: 0.3,
      // @ts-ignore
      delay: el.dataset.index * 0.1,
      onComplete: done
    })
  }, main.value)
}

function onLeave(el: Element, done: () => void) {
  ctx.value = gsap.context((self) => {
    gsap.to(el, {
      opacity: 0,
      x: '-100%',
      // delay: -el.dataset.index * 0.1,
      onComplete: done
    })
  }, main.value)
}

onUnmounted(() => {
  ctx.value ? ctx.value.revert() : null;
})
</script>

<style scoped lang="scss">
nav {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 149px 15px;
  border-bottom-left-radius: 15px 225px;

  @media (min-width: 768px) {
    border-top-left-radius: 0;
    border-top-right-radius: 15px 149px;
    border-bottom-right-radius: 349px 15px;
    border-bottom-left-radius: 0;
  }
}
</style>