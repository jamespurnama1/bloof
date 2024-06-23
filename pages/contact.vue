<script setup lang="ts">
definePageMeta({
  layout: 'sub'
})

const CMSStore = useCMSStore()
const UIStore = useUIStore()
const config = useRuntimeConfig()

// if (process.server) {
//   const { data: landing } = await useFetch<landingData>(`https://api.cosmicjs.com/v3/buckets/bloof-production/objects/65570bde15339469859176f9?read_key=${config.COSMIC_READ_KEY}&depth=1&props=metadata,`);
//   if (landing.value) {
//     CMSStore.landingData = landing.value;
//   } else {
//     throw Error
//   }
//   console.log(CMSStore.landingData)
// }

onMounted(async () => {
  // CMSStore.$subscribe((mutation, state) => {
  //   console.log(CMSStore.landingData)
  // })
})
</script>

<template>
  <section class="md:ml-[100px]">
    <div v-if="CMSStore.landingData" class="h-[66vh]">
      <Maps />
    </div>
    <NuxtLink external to="https://maps.app.goo.gl/wuhZUwjokcWtqcGY9">
      <address class="text-xs md:text-sm px-5 md:px-12 py-3">Jl. Dr. Setiabudi No.66, Hegarmanah, Kec. Cidadap, Kota
        Bandung, Jawa Barat&nbsp;40141</address>
    </NuxtLink>
    <div class="flex flex-col items-center md:flex-row w-full px-2 md:px-12 md:mt-12">
      <div class="md:w-2/3 flex flex-col gap-5">
        <h2 class="text-4xl text-center md:text-left mt-5 md:mt-0">Contact</h2>
        <div class="flex flex-col md:flex-row gap-8 items-center">
          <span class="w-full md:w-1/2 flex items-center md:justify-start justify-center gap-2">
            <img class="md:h-12 md:w-auto h-7 w-auto" src="/images/mail.png" alt="e-mail" />
            <NuxtLink class="" to="mail:contact@bloofbdg.com">contact@bloofbdg.com</NuxtLink>
          </span>
          <span class="w-full md:w-1/2 flex items-center md:justify-start justify-center gap-2">
            <img class="md:h-12 md:w-auto h-7 w-auto" src="/images/phone.png" alt="phone" />
            <NuxtLink class="" to="tel:+6281120008999">0811-2000-8999</NuxtLink>
          </span>
        </div>
        <h2 class="text-4xl text-center md:text-left">Opening Hours</h2>
        <div class="flex gap-5 mx-auto md:mx-0">
          <ul>
            <li>Monday</li>
            <li>Tuesday</li>
            <li>Wednesday</li>
            <li>Thursday</li>
            <li>Friday</li>
            <li>Saturday</li>
            <li>Sunday</li>
          </ul>
          <ul>
            <li>Closed</li>
            <li>7AM-1PM, 5PM-11PM</li>
            <li>7AM-1PM, 5PM-11PM</li>
            <li>7AM-1PM, 5PM-11PM</li>
            <li>7AM-1PM, 5PM-11PM</li>
            <li>7AM-1PM, 5PM-11PM</li>
            <li>7AM-1PM, 5PM-11PM</li>
          </ul>
        </div>
      </div>
      <div class="w-1/3 h-full flex items-center justify-center">
        <img src="/images/bird_fly.png" alt="Bloof Bird Flying" class="h-36 w-auto object-contain" />
      </div>
    </div>
  </section>
</template>
