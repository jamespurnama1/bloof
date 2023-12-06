<script setup lang="ts">
import { useUIStore } from '~/stores/UI'
import { useCMSStore } from '~/stores/fetch'
import super1 from '~/assets/super1.json'

const main = ref();
const ctx = ref();
const socialsHover = ref();
const privateRoom = ref('');
const { $gsap: gsap, $ScrollTrigger: ScrollTrigger } = useNuxtApp();
const UIStore = useUIStore();
const CMSStore = useCMSStore();
const lottieAnimation = ref();


const scrollDown = () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });

function onLoad(index: number) {
  document.querySelector(`.lottie-${index} svg`)?.setAttribute('preserveAspectRatio', 'xMidYMid slice')
  // @ts-ignore
  lottieAnimation.value![index].playSegments([0, 300], true)
}

// function handleNewsletter() {
//   if (!formStore.emailIsValid) {
//     newsletterTried.value = true;
//     return
//   }
//   //submit to firebase
//   modal.value = true;
//   newsletterSubmitted.value = true
//   newsletter.value = false;
// }

onMounted(async () => {
  await nextTick()
  ctx.value = gsap.context((self) => {
    // Nav Auto
    ScrollTrigger.create({
      trigger: 'header',
      start: 'bottom center',
      end: 'bottom center',
      onEnter: () => {
        UIStore.showNav = true;
      },
      onEnterBack: () => {
        UIStore.showNav = false;
      },
    })

    // Gallery Horizontal
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.gallery',
        scrub: 0.3,
        end: '50%'
      }
    }).to('.gallery div:first-child', {
      x: '-=40dvw'
    }).to('.gallery div:last-child', {
      x: '+=40dvw',
    }, '<')

    // Menu Zoom
    ScrollTrigger.batch('.zoom', {
      onEnter: (elements, triggers) => {
        gsap.to(elements, {
          scale: 1.2,
          scrollTrigger: {
            trigger: elements[0],
            scrub: 1
          }
        });
      }
    })
  }, main.value);
});

onUnmounted(() => {
  ctx.value ? ctx.value.revert() : null;
});
</script>

<template>
  <!-- Hero --->
  <header class="h-screen w-full flex flex-col relative justify-center items-center z-20">
    <img src="/logo.svg" alt="Bloof Logo" class="lg:h-72 lg:max-h-[30%] h-36 w-auto relative z-10" />
    <div class="transition-opacity duration-1000" :class="[UIStore.loadingScreen ? 'opacity-0' : 'opacity-100']">
      <h1 class="text-7xl">Bloof</h1>
      <div class="absolute top-0 left-0 -z-10 w-full h-full bg-gradient-to-b from-transparent to-white opacity-40" />
      <img @click="scrollDown" src="/images/arrow.svg" alt="Arrow Down" aria-label="Arrow-Down"
        class="mt-5 h-20 lg:h-24 w-auto bottom-10 left-1/2 -translate-x-1/2 absolute" />
      <nuxtImg v-if="CMSStore.landingData" preload provider="imgix"
        :src="CMSStore.landingData.hero_image.imgix_url.replace('https://imgix.cosmicjs.com', '')" alt="Bloof Restaurant"
        densities="x1 x2" sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw"
        :placeholder="[50, 25, 75, 5]" class="absolute -z-20 h-full w-full object-cover top-0 left-0" />
    </div>
  </header>
  <main v-if="CMSStore.landingData" class="md:ml-[100px]">
    <!-- Desc --->
    <section class="flex min-h-screen bg-warm-200 items-center justify-center">
      <h2 class="xl:text-7xl xl:leading-none lg:text-5xl text-3xl text-center mx-auto max-w-7xl p-5 inline-block">Perched atop Hemangini Hotel, <img class="inline-block align-middle h-8 md:h-20" src="/images/bird_fly.svg" alt="Bloof" /> is a rooftop haven boasting stunning skyline views <img class="inline-block align-middle h-8 md:h-12 xl:h-20" src="/images/pattern1.svg" alt="pattern 1" /> and an innovative cocktail program. <img class="inline-block align-middle h-8 md:h-12 xl:h-20 w-auto" src="/images/pattern2.svg" alt="pattern 2" /> Discover an <span class="circle py-3 -my-3 md:py-7 md:-my-7">enchanting</span> blend of indoor-outdoor spaces adorned by a sculptural bar, seamlessly <img class="inline-block align-middle h-8 md:h-12 xl:h-20" src="/images/pattern3.svg" alt="pattern 3" /> merging sophistication with a magnetic&nbsp;ambiance.</h2>
    </section>
    <!-- Gallery --->
    <section class="gallery flex gap-5 h-[50dvh] min-h-[500px] w-full overflow-hidden flex-col my-5">
      <div class="h-1/2 flex w-max">
        <img class="object-cover w-96" v-for="image in CMSStore.getFirstRow"
          :src="`${image.imgix_url}?auto=compress&q=75&w=640`" />
      </div>
      <div class="h-1/2 self-end flex w-max">
        <img class="object-cover w-96" v-for="image in CMSStore.getSecondRow"
          :src="`${image.imgix_url}?auto=compress&q=75&w=640`" />
      </div>
    </section>
    <!-- Menu --->
    <section class="menu relative h-screen flex justify-start items-end p-4 md:p-10 overflow-hidden">
      <NuxtLink to="/menu" class="md:mb-10">
        <h3 class="text-3xl md:text-5xl text-white text-center">Menu</h3>
        <p class="text-white text-center tracking-[0.3em] text-sm md:text-lg">Chapter 1</p>
      </NuxtLink>
      <img src="/images/arrow.svg" alt="Arrow Down" aria-label="Arrow-Down"
        class="md:mt-5 md:h-24 h-12 w-auto rotate-[220deg] invert arrow" />
      <div
        class="absolute top-0 left-0 object-cover w-full h-full bg-gradient-to-b from-transparent to-black opacity-40 -z-10" />
      <img class="zoom absolute top-0 left-0 object-cover w-full h-full -z-20"
        :src="CMSStore.landingData.menu.metadata.thumbnail.imgix_url">
    </section>
    <!-- Socials --->
    <section class="h-[100dvh] flex flex-col">
      <div class="w-full bg-warm-400 flex px-6 py-4 items-center gap-6">
        <h3 class="text-3xl xl:text-5xl">Socials</h3>
        <img src="/images/bird_wave.svg" class="h-12 md:h-20 xl:h-36" alt="Bloof Bird" />
      </div>
      <div class="flex w-full flex-col md:flex-row flex-1 bg-pink-200">
        <NuxtLink external target="_blank" @mouseover="socialsHover = index" @mouseleave="socialsHover = null"
          v-for="(value, key, index) in CMSStore.landingData.socials" :to="value" class="flex-1">
          <div class="flex w-full h-full items-center justify-center relative overflow-hidden">
            <h4 class="relative z-10 text-4xl">{{ key }}</h4>
            <ClientOnly>
              <Vue3Lottie ref="lottieAnimation" class="min-h-full min-w-full absolute overflow-hidden transition-opacity"
                :class="[socialsHover === index ? 'opacity-100' : 'opacity-0', `lottie-${index}`]" :animationData="super1"
                :noMargin="true" :width="1 / Object.keys(CMSStore.landingData.socials).length" height="100%"
                :auto-play="true" @on-animation-loaded="onLoad(index)" />
            </ClientOnly>
          </div>
        </NuxtLink>
      </div>
    </section>
    <!-- Events --->
    <section class="happenings relative h-[100dvh] flex justify-end items-end p-2 md:p-10 overflow-hidden">
      <NuxtLink to="/happenings" class="mb-5">
        <h3 class="md:text-5xl text-3xl text-white text-center">Happenings</h3>
      </NuxtLink>
      <img src="/images/arrow.svg" alt="Arrow Down" aria-label="Arrow-Down"
        class="md:mt-5 md:mb-0 mb-2 md:h-24 h-12 w-auto rotate-[220deg] invert arrow" />
      <div
        class="absolute top-0 left-0 object-cover w-full h-full bg-gradient-to-b from-transparent to-black opacity-40 -z-10" />
      <NuxtImg class="zoom absolute top-0 left-0 object-cover w-full h-full -z-20"
        :src="CMSStore.landingData.happening.metadata.thumbnail.imgix_url" />
    </section>
    <!-- Maps --->
    <section class="h-[100dvh]">
      <Maps />
    </section>
    <!-- Reservations --->
    <section id="reservation" class="md:min-h-[100dvh] flex flex-col md:flex-row">
      <div class="flex items-center justify-center relative overflow-hidden md:w-1/2 min-h-[50dvh] md:min-h-0">
        <div class="bg-warm-200 px-4 py-2 relative z-10">
          <h3 class="text-3xl md:text-5xl">Reservations</h3>
        </div>
        <!-- <ClientOnly>
          <Vue3Lottie ref="lottieReservations" class="min-h-full min-w-full absolute overflow-hidden transition-opacity"
            :animationData="super1" :noMargin="true" width="50%" height="100%" :auto-play="true" />
        </ClientOnly> -->
        <Transition name="fade">
          <img v-if="!privateRoom" class="w-full h-full absolute object-cover" src="/images/super2.svg"
            alt="Bloof Pattern" />
          <img v-else-if="privateRoom === 'bloof_belly'" class="w-full h-full absolute object-cover"
            :src="`${CMSStore.landingData.private_rooms.bloof_belly.imgix_url}?w=720`" alt="Bloof Pattern" />
          <img v-else-if="privateRoom === 'bloof_eye'" class="w-full h-full absolute object-cover"
            :src="`${CMSStore.landingData.private_rooms.bloof_eye.imgix_url}?w=720`" alt="Bloof Pattern" />
        </Transition>
      </div>
      <div class="flex items-center justify-center md:w-1/2 h-auto bg-teal-400 p-10">
        <ClientOnly>
          <Reservation @private-room="(e) => privateRoom = e" />
        </ClientOnly>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.happenings:hover,
.menu:hover {
  .arrow {
    animation: rotate 2s steps(4, end) infinite;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(190deg);
  }
  50% {
    transform: rotate(230deg);
  }
  100% {
    transform: rotate(200deg);
  }
}

.circle {
  background-image: url('/images/circle.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>