<script setup lang="ts">
useSeoMeta({
  title: 'Bloof',
  ogTitle: 'Bloof',
  description: 'Bloof Bandung.',
  ogDescription: 'Bloof Bandung.',
  ogImage: 'https://bloofbdg.com/cover.jpg',
  twitterCard: 'summary_large_image',
})

const CMSStore = useCMSStore()
if (process.server) {
  CMSStore.getLanding()
  CMSStore.getMenu()
  CMSStore.getEvents()
  CMSStore.getHappenings()
  CMSStore.getGallery()
  CMSStore.getFood()
  CMSStore.getDrinks()
}

const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
const UIStore = useUIStore();
const bottom = ref(false);
const width = ref(0);
const newsletterTried = ref(false);
const modal = ref(false);
const newsletter = ref(false);
const newsletterSubmitted = ref(false);
const formStore = useFormStore();
const { currentRoute } = useRouter();

function updateWidth() {
  width.value = window.innerWidth;
  UIStore.width = width.value;
};

function handleNewsletter() {
  if (!formStore.emailIsValid) {
    newsletterTried.value = true;
    return
  }
  //submit to firebase
  modal.value = true;
  newsletterSubmitted.value = true
  newsletter.value = false;
}

function req() {
  // if(currentRoute.value.path !== '/gallery') return;
  try {
    ; (DeviceOrientationEvent as any).requestPermission();
  } catch (error) {
  }
}

onMounted(() => {
  UIStore.$subscribe((mutation, state) => {
    if (UIStore.loadingScreen || newsletterTried.value || newsletterSubmitted.value) return;
    setTimeout(() => {
      newsletter.value = true;
    }, 1500);
  })

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

  <!-- Newsletter -->
  <Pop v-if="newsletter" @close="newsletter = false; newsletterTried = true; req()" @submit="handleNewsletter()"
    title="Don’t miss out on promotions!"
    :content="newsletterTried ? `<span class='text-pink-800'>Please enter a valid e-mail address.</span>` : 'Sign up for our newsletter'"
    bird="fly">
    <div class="flex items-center w-full gap-3 md:gap-5 justify-center flex-col md:flex-row">
      <BloofInput class="flex-1 max-w-xl" type="email" label="email" placeholder="Enter your e-mail here"
        :required="true" />
      <button class="button_pink text-xl md:text-3xl my-2" @click="handleNewsletter()">Submit</button>
    </div>
  </Pop>
  <Pop v-else-if="modal && !newsletter" @close="modal = false" @submit="modal = false; req()"
    :title="`We’ve sent an email to ${formStore.email}`" content="" bird="thank" />

  <NuxtLayout>
    <Cursor v-if="width > 768" />
    <Navigation />
    <NuxtPage />
    <Transition name="fade">
      <aside v-show="bottom" class="fixed right-5 bottom-5 md:right-10 md:bottom-10">
        <button @click="scrollTop()" class="flex items-center justify-center">
          <p class="text-sm md:text-base">Back to top</p>
          <img src="/images/arrow.svg" alt="Arrow Up" aria-label="Arrow-Up" class="rotate-180 h-8 md:h-12 w-auto" />
        </button>
      </aside>
    </Transition>
    <footer class="h-64 md:h-[500px] flex items-center justify-center flex-col">
      <img src="/logo.svg" alt="Bloof Logo" class="h-16 md:h-32 lg:h-48 lg:max-h-[30%]  w-auto" />
      <h5 class="text-3xl md:text-5xl">Bloof</h5>
      <p class="md:text-xs text-[0.6em]">© 2023 Bloof is part of hemangini Hotel</p>
    </footer>
  </NuxtLayout>
</template>
