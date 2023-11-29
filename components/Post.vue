<template>
  <div class="w-full py-3 px-5 flex items-center"
    :class="[`bg-${bg}`, index % 2 === 1 ? 'justify-start' : 'justify-end']">
    <h2 class="text-5xl md:text-7xl">{{ title }}</h2>
  </div>
  <Swiper
    ref="swiperRef"
    v-if="posts.length"
    :modules="[SwiperMousewheel, SwiperAutoplay]"
    :mousewheel="true"
    :loop="true"
    :autoplay="{delay: 1500, pauseOnMouseEnter: true}"
    :breakpoints="{
      320: {
        slidesPerView: 1
      },
      768: {
        slidesPerView: 4
      },
    }"
    class="group/slider overflow-x-scroll overflow-y-hidden flex h-48 md:h-64 lg:h-72 w-full relative">
    <!-- <button @click="test()" class="absolute left-5 z-20 top-1/2 -translate-y-1/2 bg-warm-200 bordered p-2 hover:scale-110 active:duration-0 active:translate-x-[3px] active:translate-y-[1px] hover:disabled:scale-100 transition">
      <img src="/images/caret.svg" :alt="`${title} Slide left`" class="transition h-5 w-auto object-cover rotate-180">
    </button> -->
    <SwiperSlide class="relative h-full overflow-hidden" v-for="post in (shuffledArray as happening[] | number[])">
      <NuxtLink v-if="typeof post !== 'number'" :to="post.slug" class=" group/item p-2 w-full h-full flex items-end">
        <h3 class="text-white relative z-10 whitespace-nowrap overflow-ellipsis max-w-[80%] overflow-hidden text-xl">{{
          post.title }}</h3>
        <div
          class="bg-gradient-to-b w-full h-full absolute top-0 left-0 from-transparent to-teal-600 opacity-75 mix-blend-multiply -z-0" />
        <nuxtImg preload provider="imgix"
          class="grayscale absolute top-0 left-0 object-cover w-full h-full -z-10 group-hover/item:scale-125 group-hover/slider:grayscale-0 transition duration-700 brightness-50 group-hover/item:brightness-100"
          :src="post.metadata.thumbnail.imgix_url.replace('https://imgix.cosmicjs.com', '')" :alt="post.title"
          densities="x1 x2" sizes="xs:25vw sm:25vw md:25vw lg:25vw xl:25vw xxl:25vw 2xl:25vw"
          :placeholder="[50, 25, 75, 5]" />
      </NuxtLink>
      <img v-else class="flex-1 h-full w-full object-cover" :src="`/images/super${post}.svg`" alt="Bloof Pattern">
    </SwiperSlide>
        <!-- <button @click="swiperRef.slideNext()" class="absolute right-5 z-20 top-1/2 -translate-y-1/2 bg-warm-200 bordered p-2 hover:scale-110 active:duration-0 active:translate-x-[3px] active:translate-y-[1px] hover:disabled:scale-100 transition">
        <img src="/images/caret.svg" :alt="`${title} Slide Right`" class="transition h-5 w-auto object-cover">
      </button> -->
  </Swiper>
  <div class="w-full h-48 md:h-64 lg:h-72 relative flex items-center justify-center" v-else>
    <div class="bordered bg-warm-200 p-5 relative z-10 flex items-center justify-center">
      <h3 class="text-center text-black text-3xl md:text-5xl">No {{ title.endsWith("s") ? title : title + 's' }} yet...</h3>
    </div>
    <img class="absolute top-0 left-0 w-full h-full object-cover -z-0" :src="`/images/super${getRandomInt(3)}.svg`"
      alt="Bloof Pattern">
  </div>
</template>

<script setup lang="ts">
const swiperRef = ref();
const swiper = useSwiper();

function test() {
  swiper.value.slideNext()
}
// defineProps<{
//   title: string
//   bg: string
//   index: number
//   posts: happening[] | string[]
// }>()

const props = defineProps(['title', 'bg', 'index', 'posts'])

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max) + 1;
}

function shuffle(array: any[]) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

let shuffledArray = [...props.posts];
shuffledArray = [...shuffledArray, getRandomInt(3)];
for(let i=0; shuffledArray.length <= 4; i++) {
  shuffledArray = [...shuffledArray, getRandomInt(3)];
}

shuffle(shuffledArray)

onMounted(() => {
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