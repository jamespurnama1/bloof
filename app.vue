<script setup lang="ts">
import type { PostHog } from 'posthog-js';

// useSeoMeta({
//   title: 'Bloof',
//   ogTitle: 'Bloof',
//   description: 'Bloof Bandung.',
//   ogDescription: 'Bloof Bandung.',
//   ogImage: 'https://bloofbdg.com/cover.jpg',
//   twitterCard: 'summary_large_image',
// })

const CMSStore = useCMSStore();
if (process.server) {
  CMSStore.getLanding()
  CMSStore.getMenu()
  CMSStore.getEvents()
  CMSStore.getHappenings()
  CMSStore.getGallery()
  CMSStore.getFood()
  CMSStore.getDrinks()
  // CMSStore.getBreakfast()
}

let posthog = null as null | PostHog

const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
const UIStore = useUIStore();
const bottom = ref(false);
const width = ref(0);
const newsletterTried = ref(false);
const modal = ref(false);
const error = ref(false);
const newsletter = ref(false);
const newsletterSubmitted = ref(false);
const formStore = useFormStore();
const { currentRoute } = useRouter();

function updateWidth() {
  width.value = window.innerWidth;
  UIStore.width = width.value;
};

async function handleNewsletter() {
  if (!formStore.emailIsValid || !posthog) {
    newsletterTried.value = true;
    return
  }
  //submit to firebase
  posthog.identify(formStore.email)

  pushDatabase(formStore.email)
  .then(() => {
    newsletterSubmitted.value = true;
    modal.value = true;
  }).catch(() => {
    error.value = true;
  })
  newsletter.value = false;
}

function req() {
  // if(currentRoute.value.path !== '/gallery') return;
  try {
    ; (DeviceOrientationEvent as any).requestPermission();
  } catch (error) {
  }
}

const maxPercentage = ref(0);
const maxPixels = ref(0);

function handleScroll() {
      bottom.value = (window.innerHeight + window.scrollY + 50) >= document.body.offsetHeight;
  const lastPercentage = Math.min(
    1,
    (window.innerHeight + window.scrollY) / document.body.offsetHeight
  );
  const lastPixels = window.innerHeight + window.scrollY;
  if (lastPercentage > maxPercentage.value) {
    maxPercentage.value = lastPercentage;
  }

  if (lastPixels > maxPixels.value) {
    maxPixels.value = lastPixels;
  }
}

onMounted(() => {
  const { $posthog } = useNuxtApp()
  posthog = $posthog() as PostHog
  UIStore.$subscribe((mutation, state) => {
    if (UIStore.loadingScreen || newsletterTried.value || newsletterSubmitted.value) return;
    setTimeout(() => {
      newsletter.value = true;
    }, 1500);
  })
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', updateWidth);
  updateWidth();
});

watch(currentRoute, value => {
  if (!window || !posthog) return;
  posthog.capture('Pageleave', {
    'max scroll percentage': maxPercentage.value,
    'max scroll pixels': maxPixels.value,
    'last scroll percentage': Math.min(
      1,
      (window.innerHeight + window.scrollY) / document.body.offsetHeight
    ),
    'last scroll pixels': window.innerHeight + window.scrollY,
    scrolled: maxPixels.value > 0
  });
}, { deep: true })
</script>

<template>
  <ClientOnly>
    <loadingScreen v-if="UIStore.loadingScreen" />
  </ClientOnly>

  <!-- Newsletter -->
  <Pop v-if="newsletter" @close="newsletter = false; newsletterTried = true; req()" @submit="handleNewsletter()"
    title="Don’t miss out on promotions!"
    :content="newsletterTried ? `<span class='text-pink-800'>Please enter a valid e-mail address.</span>` : 'Sign up for our newsletter'"
    bird="fly">
    <form class="flex items-center w-full gap-3 md:gap-5 justify-center flex-col md:flex-row">
      <BloofInput class="flex-1 max-w-xl" type="email" label="email" placeholder="Enter your e-mail here"
        :required="true" />
      <button type="submit" class="button_pink text-xl md:text-3xl my-2" @click.prevent="handleNewsletter()">Submit</button>
    </form>
  </Pop>
  <LazyPop v-else-if="modal && !newsletter" @close="modal = false" @submit="modal = false; req()"
    :title="`We’ve sent an email to ${formStore.email}`" content="" bird="thank" />
  <LazyPop v-else-if="!newsletter && error" @close="error = false" @submit="reloadNuxtApp()" title="Something went wrong" bird="thank" button="Reload Me" />
  <NuxtLayout>
    <Cursor v-if="width > 768" />
    <Navigation />
    <NuxtPage />
    <Transition name="fade">
      <aside v-show="bottom" class="fixed right-5 bottom-5 md:right-10 md:bottom-10">
        <button @click="scrollTop()" class="flex items-center justify-center">
          <p class="text-sm md:text-base">Back to top</p>
          <img src="/images/arrow.png" alt="Arrow Up" aria-label="Arrow-Up" class="rotate-180 h-8 md:h-12 w-auto" />
        </button>
      </aside>
    </Transition>
    <footer class="h-64 md:h-[500px] flex items-center justify-center flex-col">
      <img src="/logo.png" alt="Bloof Logo" class="h-16 md:h-32 lg:h-48 lg:max-h-[30%]  w-auto" />
      <h2 class="text-3xl md:text-5xl">Bloof</h2>
      <p class="md:text-xs text-[0.6em]">© 2023 Bloof is part of Hemangini Hotel</p>
    </footer>
  </NuxtLayout>
</template>
