<script setup lang="ts">
definePageMeta({
  layout: 'sub'
})

const swiperRef = ref();
const { $Autoplay, $mdRenderer } = useNuxtApp()
const CMSStore = useCMSStore();
const more_description = ref();


onMounted(async () => {
  more_description.value = $mdRenderer.render(CMSStore.eventsData.more_description);
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
      <h2 v-html="CMSStore.eventsData.description"
        class="xl:text-7xl xl:leading-tight lg:text-5xl text-3xl text-center mx-auto px-5" />
    </section>
    <ClientOnly v-if="CMSStore.eventsData.brochures && CMSStore.eventsData.brochures.length">
      <section class="flex flex-col items-center w-full gap-3">
        <h3 class="text-3xl md:text-5xl text-center">Special Packages</h3>
        <swiper-container ref="swiperRef" init="false" class="flex w-full">
          <swiper-slide class="m-auto" v-for="(brochure, i) in CMSStore.eventsData.brochures" :key="i">
            <NuxtPicture preload provider="imgix" class="object-cover m-auto max-h-[80vh] w-auto"
              :src="brochure.brochure.imgix_url.replace('https://imgix.cosmicjs.com', '')" alt="" densities="x1 x2"
              :sizes="`xs:100vw sm:100vw md:50vw lg:50vw xl:50vw xxl:50vw 2xl:50vw`" :placeholder="[50, 25, 75, 5]" />
          </swiper-slide>
        </swiper-container>
      </section>
    </ClientOnly>
    <section class="min-h-[50dvh] p-12 flex items-center justify-center flex-col gap-3">
      <h3 class="text-3xl md:text-5xl text-center max-w-xs" v-html="CMSStore.eventsData.call_to_action" />
      <p v-if="more_description" class="max-w-xs md:max-w-xl" v-html="more_description"></p>
    </section>
    <section class="bg-warm-400 min-h-[50dvh] p-12 flex items-center justify-center">
      <EventForm />
    </section>
  </main>
</template>