<template>
  <div class="w-full py-3 px-5 flex items-center"
    :class="[`bg-${bg}`, index % 2 === 1 ? 'justify-start' : 'justify-end']">
    <h2 class="text-3xl md:text-7xl">{{ title }}</h2>
  </div>
  <ClientOnly v-if="posts.length">
    <swiper-container ref="swiperRef" init="false"
      class="group/slider overflow-x-scroll overflow-y-hidden flex h-48 md:h-64 lg:h-72 w-full relative">
      <!-- <button @click="test()" class="absolute left-5 z-20 top-1/2 -translate-y-1/2 bg-warm-200 bordered p-2 hover:scale-110 active:duration-0 active:translate-x-[3px] active:translate-y-[1px] hover:disabled:scale-100 transition">
      <img src="/images/caret.svg" :alt="`${title} Slide left`" class="transition h-5 w-auto object-cover rotate-180">
    </button> -->
      <swiper-slide class="relative h-full overflow-hidden" v-for="(post, i) in (shuffledArray as happening[] | number[])"
        :key="i">
        <NuxtLink v-if="typeof post !== 'number'" :to="`/happenings/${post.slug}`" class=" group/item p-2 w-full h-full flex items-end">
          <h3 class="text-white relative z-10 whitespace-nowrap overflow-ellipsis max-w-[80%] overflow-hidden text-xl">{{
            post.title }}</h3>
          <div
            class="bg-gradient-to-b w-full h-full absolute top-0 left-0 from-transparent to-teal-600 opacity-75 mix-blend-multiply -z-0" />
          <NuxtPicture preload provider="imgix"
            class="md:grayscale absolute top-0 left-0 object-cover w-full h-full -z-10 group-hover/item:scale-125 group-hover/slider:grayscale-0 transition duration-700 md:brightness-50 group-hover/item:brightness-100"
            :src="post.metadata.thumbnail.imgix_url.replace('https://imgix.cosmicjs.com', '')" :alt="post.title"
            densities="x1 x2" :sizes="`xs:100vw sm:100vw md:100vw lg:${Math.max(1, Math.min(props.posts.length, 4)) / 100}vw xl:${Math.max(1, Math.min(props.posts.length, 4))/100}vw xxl:${Math.max(1, Math.min(props.posts.length, 4)) / 100}vw 2xl:${Math.max(1, Math.min(props.posts.length, 4)) / 100}vw`"
            :placeholder="[50, 25, 75, 5]" />
        </NuxtLink>
        <img v-else class="flex-1 h-full w-full object-cover" :src="`/images/super${post}.svg`" alt="Bloof Pattern">
      </swiper-slide>
      <!-- <button @click="swiperRef.slideNext()" class="absolute right-5 z-20 top-1/2 -translate-y-1/2 bg-warm-200 bordered p-2 hover:scale-110 active:duration-0 active:translate-x-[3px] active:translate-y-[1px] hover:disabled:scale-100 transition">
        <img src="/images/caret.svg" :alt="`${title} Slide Right`" class="transition h-5 w-auto object-cover">
      </button> -->
    </swiper-container>
  </ClientOnly>
  <div class="w-full h-48 md:h-64 lg:h-72 relative flex items-center justify-center" v-else>
    <div class="bordered bg-warm-200 p-5 relative z-10 flex items-center justify-center">
      <h3 class="text-center text-black text-xl md:text-5xl">No {{ title.endsWith("s") ? title : title + 's' }} yet...
      </h3>
    </div>
    <img class="absolute top-0 left-0 w-full h-full object-cover -z-0 saturate-0" :src="`/images/super${getRandomInt(3)}.svg`"
      alt="Bloof Pattern">
  </div>
</template>

<script setup lang="ts">
const UIStore = useUIStore()
const swiperRef = ref();
const { $Autoplay } = useNuxtApp()

const props = defineProps(['title', 'bg', 'index', 'posts'])

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max) + 1;
}

function shuffle(array: any[]) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

let shuffledArray = [...props.posts];

function resize() {
  if (UIStore.width < 768 || props.posts.length < 4) return;
  shuffledArray = [...shuffledArray, getRandomInt(3)];
  for (let i = 0; shuffledArray.length <= 4; i++) {
    shuffledArray = [...shuffledArray, getRandomInt(3)];
  }
}

shuffle(shuffledArray)

onMounted(async () => {
  resize();
  UIStore.$subscribe((mutation, state) => {
    resize();
  })
  const params = {
    modules: [$Autoplay],
    loop: true,
    autoplay: { delay: 1500, pauseOnMouseEnter: true },
    breakpoints: {
      320: {
        slidesPerView: 1
      },
      768: {
        slidesPerView: Math.max(1, Math.min(props.posts.length, 4))
      },
    }
  }
  await nextTick()
  if (!swiperRef.value) return;
  Object.assign(swiperRef.value, params)
  swiperRef.value.initialize()
})
</script>

<style lang="scss" scoped>
.bordered {
  border-top-left-radius: 331px 15px;
  border-top-right-radius: 15px 278px;
  border-bottom-right-radius: 245px 15px;
  border-bottom-left-radius: 15px 301px;
  @apply outline-[6px] outline outline-black
}
</style>