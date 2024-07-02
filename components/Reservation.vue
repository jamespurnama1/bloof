<script setup lang="ts">
import type { PostHog } from 'posthog-js';

const UIStore = useUIStore();
const formStore = useFormStore();
const CMSStore = useCMSStore();
const privateRoom = ref({
  name: ['Bloof Eye', 'Bloof Belly'],
  checked: false,
  index: 0,
});
const tandc = ref()
const emit = defineEmits(['private-room'])
const config = useRuntimeConfig()
const timeData = ref([]) as Ref<reservationTime[] | []>
const availableTime = ref([]) as Ref<reservationTime[] | []>
const date = ref(new Date(new Date(Date.now()).setHours(new Date().getHours() + 1)));
const guests = ref(1);
const terms = ref(false);
const tried = ref(false);
const modal = ref(false);
const submitted = ref(false);
const purposes = ref([] as purpose[]);
// 1 month
const maxDate = new Date(Date.now()).getTime() + 2629800000;
const max = computed(() => privateRoom.value.checked && privateRoom.value.name[privateRoom.value.index] === 'Bloof Eye' ? 8 : 10)
// 1 hour
const minDate = new Date(Date.now()).getTime() + 3600000;

const noMondays = ref([] as Date[]);
let posthog = null as null | PostHog

for (let i = 0; i <= 5; i++) {
  const d = new Date(Date.now());
  //add 5 mondays
  const mon = d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7) + (i * 604800016.56);
  noMondays.value.push(new Date(mon));
}

function setTime(string: string) {
  onDateChange(getDate.value.setHours(parseInt(string.split(':')[0]), parseInt(string.split(':')[1])))
  const index = availableTime.value.findIndex(x => x.time === string);
  // Safety if not found change to 0
  timeIndex.value = index > 0 ? index : 0;
}

function handlePrivateRoom(checked: boolean) {
  if (checked) {
    privateRoom.value.index ? privateRoom.value.index = 0 : privateRoom.value.index = 1;
    emit('private-room', privateRoom.value.name[privateRoom.value.index].toLowerCase().replace(' ', '_'))
  } else {
    emit('private-room', '')
  }
  getGuests.value = guests.value
}

const getGuests = computed({
  get() {
    return guests.value === 1 ? `${guests.value} guest` : `${guests.value} guests`;
  },
  set(val: string | number) {
    if (guests.value >= max.value && val === '+') {
      guests.value = 1
    } else if (guests.value <= 1 && val === '-') {
      guests.value = max.value
    } else if (val === '+') {
      guests.value++
    } else if (val === '-') {
      guests.value--
    } else {
      guests.value = Math.min(val as number, max.value)
    }
    formStore.guests = guests.value;
  }
});

const headers = {
  Authorization: `Bearer ${config.public.ESB_TOKEN}`,
  'Data-Branch': config.public.ESB_BRANCH_CODE as string
}

// Calendar

const timeInString = computed(() => getDate.value.getHours().toString().padStart(2, '0') + ":" + getDate.value.getMinutes().toString().padStart(2, '0'))

const getDate = computed({
  get() {
    return date.value
  },
  set(val) {
    let computedVal = val.getTime();
    // reset time to 17:00 if more than 1 day
    // TODO ESB
    if (Math.abs(computedVal - date.value.getTime()) >= 86400000) {
      computedVal = new Date(computedVal).setHours(17, 0);
    }
    // set minimum 1 hour from now. set maximum 1 month from now
    computedVal = Math.max(minDate, Math.min(maxDate, computedVal))
    //check if monday. Add or sub 1 day
    if (new Date(computedVal).getDay() === 1 && maxDate <= computedVal) {
      computedVal = computedVal - 86400000
    } else if (new Date(computedVal).getDay() === 1) {
      computedVal = computedVal + 86400000
    }
    // increments of 30 minutes
    computedVal = Math.floor(computedVal / 1800000) * 1800000;

    date.value = new Date(computedVal);
    formStore.date = date.value;
    formStore.dateAvailability = timeData.value.find(x => x.time === timeInString.value)?.available
  }
})

const attributes = computed(() =>
  [{
    highlight: true,
    dates: date.value,
  }]);

const timeIndex = ref(0);

formStore.reset()

async function onDateChange(date: Date | number) {
  if (typeof date === 'number') {
    getDate.value = new Date(date);
  } else {
    getDate.value = date;
  }
  await getTime()
  if (!timeData.value.length) onDateChange(getDate.value.getTime() + 86400000)
};

onDateChange(new Date(Date.now()));

async function submitReservation() {
  terms.value = false
  if (!formStore.valid || !posthog) return;
  posthog.identify(formStore.email, {
    name: formStore.name,
    phone: formStore.phone
  })

  await $fetch(`${config.public.ESB_URL}/reservation/transaction/`, {
    headers,
    method: 'POST',
    body: {
      "title": formStore.title,
      "customerName": formStore.name,
      "email": formStore.email,
      "phoneNumber": formStore.phone,
      "paxTotal": formStore.guests,
      "reservationDate": formStore.getDate,
      "reservationTime": formStore.getTime,
      "purpose": formStore.purpose,
      "notes": formStore.notes + privateRoom.value.checked ? `Reservation for private room: ${privateRoom.value.name[privateRoom.value.index]}` : ''
    }
  }).then(res => {
    if (posthog) posthog.capture('reserve', {
      success: true
    })
    submitted.value = true;
    modal.value = true;
  }, error => {
    if (posthog) posthog.capture('reserve', {
      success: false,
      error
    })
    console.error(error);
  })
}

async function getTime() {
  await Promise.all([$fetch(`${config.public.ESB_URL}/reservation/time/?reservationDate=${date.value.toISOString().substring(0, 10)}`, {
    headers,
    server: false,
  }), $fetch(`${config.public.ESB_URL}/reservation/purpose`, {
    headers,
    server: false,
  })]).then(res => {
    if (res.length) {
      //TODO: Add logic when no date is not available to find next date
      // timeData.value = (res[0] as reservationTimes).reservationTime;
      purposes.value = (res[1] as reservationPurpose).reservationPurpose;
      timeData.value = [];
      availableTime.value = [];
      (res[0] as reservationTimes).reservationTime.forEach(x => {
        (timeData.value as reservationTime[]).push(x);
        if (x.available) {
          (availableTime.value as reservationTime[]).push(x);
        }
      })
      UIStore.fetch = false;
    }
  }, error => {
    console.error(error);
  })
}

onMounted(async () => {
  const { $posthog } = useNuxtApp()
  posthog = $posthog() as PostHog
  getTime()
})
</script>

<template>
  <Pop ref="tandc" v-if="terms" @close="terms = false" title="Information and Regulation"
    :content="CMSStore.landingData.regulation" bird="fly">
    <button @click="tandc.scrollTop = tandc.scrollHeight">
      <img src="/images/arrow.png" alt="Arrow Up" aria-label="Arrow-Up" class="h-8 md:h-12 w-auto fixed right-0 bottom-5" />
    </button>
    <button
      class="button_pink text-3xl my-2 transition-transform duration-75 hover:scale-110 active:duration-0 active:translate-x-2 active:translate-y-2"
      @click="submitReservation()">Reserve</button>
  </Pop>
  <Pop v-if="submitted && modal" @close="modal = false" @submit="modal = false"
    :title="`We’ve sent an email to ${formStore.email}`" content="" bird="thank" />
  <form v-if="timeData && !submitted" class="flex flex-col max-w-2xl items-center justify-center gap-1 xl:gap-5">

    <!-- Guests -->
    <span class="flex items-center justify-center">
      <img src="/images/caret.png" class="rotate-180 p-2 h-10 xl:h-12 w-auto" alt="Guests Previous"
        @click="getGuests = '-'" />
      <p class="text-2xl xl:text-4xl text-center">{{ getGuests }}</p>
      <img src="/images/caret.png" class="p-2 h-10 xl:h-12 w-auto" alt="Guests Next" @click="getGuests = '+'" />
    </span>

    <!-- Calendar -->
    <span class="flex items-center justify-center">
      <button class="disabled:opacity-50" type="button"
        :disabled="date.toDateString() === new Date(minDate).toDateString()">
        <img @click="onDateChange(getDate.getTime() - 86400000)" src=" /images/caret.png"
          class="rotate-180 p-2 h-10 md:h-12 w-auto" alt="Date Previous" />
      </button>
      <VDropdown auto>
        <p class="text-2xl xl:text-4xl text-center">{{ date.toLocaleDateString('en-us', {
          weekday:
          "long", month: "short", day: "numeric"
          }) }}</p>
        <template #popper="{ hide }">
          <ClientOnly>
            <VCalendar v-model="getDate" :locale="{ id: 'en', firstDayOfWeek: 1 }" :attributes="attributes" borderless
              :disabled-dates="noMondays" trim-weeks @dayclick="(e) => { onDateChange(e.date); hide() }"
              :min-date="new Date(minDate)" :max-date="new Date(maxDate)" color="teal">
              <template #footer>
                <div class="w-full px-4 pb-3">
                  <button class="bg-teal-400 hover:bg-teal-200 text-white font-bold w-full px-3 py-1 rounded-md"
                    @click="onDateChange(Date.now()); hide()">
                    Today
                  </button>
                </div>
              </template>
            </VCalendar>
          </ClientOnly>
        </template>
      </VDropdown>
      <button class="disabled:opacity-50" type="button"
        :disabled="date.toDateString() === new Date(maxDate).toDateString()">
        <img @click="onDateChange(getDate.getTime() + 86400000)" src="/images/caret.png" class="p-2 h-10 xl:h-12 w-auto"
          alt="Date Next" />
      </button>
    </span>

    <!-- Time -->
    <span class="flex items-center justify-center">
      <!-- Check timeIndex is 0 & if timeData is available -->
      <button type="button" class="disabled:opacity-50"
        @click="timeIndex ? setTime(availableTime[timeIndex - 1].time) : null" :disabled="!timeIndex">
        <img src="/images/caret.png" class="rotate-180 p-2 h-10 xl:h-12 w-auto" alt="Time Previous" />
      </button>
      <VDropdown>
        <p class="text-2xl xl:text-4xl text-center">
          {{ availableTime[timeIndex] ? availableTime[timeIndex].time : '...' }}
        </p>
        <template #popper="{ hide }" class="w-max">
          <div class="p-5 grid grid-cols-2 gap-1 w-max">
            <button :disabled="!time.available" @click="setTime(time.time); hide()" v-for="time in timeData"
              class="text-sm xl:text-lg font-bold font-serif disabled:opacity-50">{{ time.time }}</button>
          </div>
        </template>
      </VDropdown>
      <button type="button" class="disabled:opacity-50" :disabled="timeIndex === availableTime.length - 1"
        @click="timeIndex === availableTime.length - 1 ? null : setTime(availableTime[timeIndex + 1].time)">
        <img src=" /images/caret.png" class="p-2 h-10 xl:h-12 w-auto" alt="Time Next" />
      </button>
      <!-- <img src="/images/caret.png" class="p-2 h-10 xl:h-12 w-auto" alt="Time Next"
        @click="onDateChange(getDate.getTime() + 1800000)" /> -->
    </span>

    <!-- Personal Info -->
    <span class="flex gap-3 w-full my-2">
      <BloofInput placeholder="Title" type="radio" label="title" />
      <BloofInput class="flex-1 w-full" placeholder="Name" type="text" label="name" :autocomplete="true" />
    </span>
    <BloofInput class="flex-1 w-full my-2" placeholder="E-mail" type="email" label="email" :autocomplete="true" />
    <BloofInput class="flex-1 w-full my-2" placeholder="Phone" type="tel" label="phone" :autocomplete="true" />
    <BloofInput class="flex-1 w-full my-2" placeholder="Purpose" type="purpose" label="purpose" :purposes="purposes"
      required />
    <BloofInput class="flex-1 w-full my-2" placeholder="Notes" type="text" label="notes" />
    <BloofInput @change-check="(e) => { privateRoom.checked = e; handlePrivateRoom(privateRoom.checked) }"
      type="checkbox" label="private" placeholder="Private Room" />
    <!-- <label for="private">Private Room</label> -->
    <span v-if="privateRoom.checked" class="flex items-center justify-center">
      <img src="/images/caret.png" class="rotate-180 p-2 h-10 xl:h-12 w-auto" alt="Date Previous"
        @click="handlePrivateRoom(true)" />
      <p class="text-2xl xl:text-4xl text-center">{{ privateRoom.name[privateRoom.index] }}</p>
      <img src="/images/caret.png" class="p-2 h-10 xl:h-12 w-auto" alt="Date Next" @click="handlePrivateRoom(true)" />
    </span>
    <!-- Minimum Purchase -->
    <p v-if="privateRoom.checked"><sup>*</sup>A minimum purchase of Rp. 2.000.000++ is required for this&nbsp;booking.
    </p>
    <p v-else-if="guests >= 5"><sup>*</sup>A minimum purchase of Rp. 500.000++ is required for this&nbsp;booking.</p>
    <p v-if="tried && !formStore.valid" class="bg-pink-400 p-2 bordered">Please fill the form&nbsp;correctly.</p>

    <!-- Submit -->
    <button class="button_pink text-xl xl:text-3xl my-2 small" type="submit" :disabled="tried && !formStore.valid"
      @click.prevent="formStore.valid ? terms = true : (tried = true, posthog?.capture('reserve', { success: false }))">Submit</button>
  </form>

  <div v-else-if="submitted">
    <h4 class="text-5xl text-center">We can't wait to see&nbsp;you!</h4>
  </div>
</template>

<style>
.vc-teal {
  --vc-accent-800: theme(colors.teal.800);
  --vc-accent-600: theme(colors.teal.600);
  --vc-accent-400: theme(colors.teal.400);
  --vc-accent-200: theme(colors.teal.200);
}

.vc-container {
  @apply font-sans;
}

.v-popper__inner {
  border: none;
}

.v-popper--theme-Grid .v-popper__inner {
  background: #d9d9d9;
  padding: 10px;
  border: none;
}

.v-popper--theme-grid .v-popper__arrow-outer {
  border-color: #d9d9d9;
}

.v-popper--theme-grid .v-popper__arrow-inner {
  visibility: hidden;
}
</style>