<script setup lang="ts">
definePageMeta({
  layout: 'sub'
})

const swiperRef = ref();
const { $Autoplay } = useNuxtApp()
const CMSStore = useCMSStore();
const callToAction = computed(() => {
  const text = (CMSStore.eventsData.callToAction ?? '').trimEnd()
  return text.replace(/\s(?=\S+$)/, '\u00a0')
})

onMounted(async () => {
  const params = {
    modules: [$Autoplay],
    loop: true,
    autoplay: { delay: 1500, pauseOnMouseEnter: true },
    breakpoints: {
      320: {
        slidesPerView: 1
      },
      768: {
        slidesPerView: 2
      },
    }
  }
  await nextTick()
  if (!swiperRef.value) return;
  Object.assign(swiperRef.value, params)
  swiperRef.value.initialize()
})
</script>

<template>
  <main class="md:ml-[100px]">
    <section class="flex h-screen bg-warm-200 items-center justify-center">
      <SanityRichText class="xl:text-7xl xl:leading-tight lg:text-5xl text-3xl text-center mx-auto px-5"
        :value="CMSStore.eventsData.description" />
    </section>
    <ClientOnly v-if="CMSStore.eventsData.brochures && CMSStore.eventsData.brochures.length">
      <section class="flex flex-col items-center w-full gap-3">
        <h3 class="text-3xl md:text-5xl text-center">Special Packages</h3>
        <swiper-container ref="swiperRef" init="false" class="flex w-full">
          <swiper-slide class="m-auto" v-for="(brochure, i) in CMSStore.eventsData.brochures" :key="i">
            <NuxtPicture preload provider="none" class="flex m-auto max-h-[80vh] w-auto"
              :imgAttrs="{ class: 'object-contain' }" :src="brochure.url || ''" :alt="brochure.alt || ''"
              densities="x1 x2" sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:50vw xxl:50vw 2xl:50vw"
              :placeholder="[50, 25, 75, 5]" />
          </swiper-slide>
        </swiper-container>
      </section>
    </ClientOnly>
    <section class="min-h-[50dvh] p-12 flex items-center justify-center flex-col gap-3">
      <h3 class="text-3xl md:text-5xl text-center max-w-xs">{{ callToAction }}</h3>
      <SanityRichText class="max-w-xs md:max-w-xl" :value="CMSStore.eventsData.moreDescription" />
    </section>
    <section class="bg-warm-400 min-h-[50dvh] p-12 flex items-center justify-center">
      <LazyEventForm />
    </section>
  </main>
</template>