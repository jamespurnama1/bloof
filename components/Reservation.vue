<script setup lang="ts">
const UIStore = useUIStore();
const formStore = useFormStore();
const selectedTime = ref(0);
const selectedPurpose = ref(0);
const config = useRuntimeConfig()
const date = ref(new Date(new Date(Date.now()).setHours(new Date().getHours() + 1)));
const guests = ref(1);
const submitted = ref(false);
const purposes = ref([] as purpose[]);
// 1 month
const maxDate = new Date(Date.now()).getTime() + 2629800000;
// 1 hour
const minDate = new Date(Date.now()).getTime() + 3600000;

const noMondays = ref([] as Date[]);

for (let i = 0; i <= 5; i++) {
  const d = new Date(Date.now());
  //add 5 mondays
  const mon = d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7) + (i * 604800016.56);
  noMondays.value.push(new Date(mon));
}

const getGuests = computed({
  get() {
    return guests.value === 1 ? `${guests.value} guest` : `${guests.value} guests`;
  },
  set(val) {
    if (guests.value >= 10 && val === '+') {
      guests.value = 1
    } else if (guests.value <= 1 && val === '-') {
      guests.value = 10
    } else if (val === '+') {
      guests.value++
    } else {
      guests.value--
    }
    formStore.guests = guests.value;
  }
});

const headers = {
  Authorization: `Bearer ${config.public.ESB_TOKEN}`,
  'Data-Branch': 'OUTB'
}

const times = ref([]) as Ref<String[]>

for (let i = 17; i <= 22; i++) {
  const time = i.toString()
  times.value.push(time + ':' + '00');
  times.value.push(time + ':' + '30');
}

// Calendar

const getDate = computed({
  get() {
    return date.value
  },
  set(val) {
    let computedVal = val.getTime();
    // reset time to 17:00 if more than 1 day
    if(Math.abs(computedVal - date.value.getTime()) >= 86400000) {
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
  }
  // if hours available
  // none are available
})


const attributes = ref([
  {
    highlight: true,
    dates: date.value,
  },
]);

// Avail time
const timeAvail = ref([]) as Ref<String[]>
// const { data, error, pending } = await fetchTime(new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDate() + 1)));


function onDateChange(date: Date | number) {
  if (typeof date === 'number') {
    getDate.value = new Date(date);
  } else {
    getDate.value = date;
  }
}

onDateChange(new Date(Date.now()));

async function submitReservation() {
  if (!formStore.valid) return;
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
      "notes": formStore.notes
    }
  }).then(res => {
    console.log(res)
    submitted.value = true;
  }, error => {
    console.error(error);
  })
}

const timeData = ref()

onMounted(async () => {
  // get dates
  await Promise.all([$fetch(`${config.public.ESB_URL}/reservation/time/?reservationDate=${date.value.toISOString().substring(0, 10)}`, {
    headers,
    server: false,
  }), $fetch(`${config.public.ESB_URL}/reservation/purpose`, {
    headers,
    server: false,
  })]).then(res => {
    if (res.length) {
      //TODO: Add logic when no date is not available to find next date
      timeData.value = res[0];
      purposes.value = (res[1] as reservationPurpose).reservationPurpose;
      (res[0] as reservationTimes).reservationTime.forEach(x => {
        if (x.available) timeAvail.value.push(x.time)
      })
      UIStore.fetching = false;
    }
  }, error => {
    console.error(error);
  })
})
</script>

<template>
  <form v-if="timeData && !submitted" class="flex flex-col max-w-2xl items-center justify-center gap-5">

    <!-- Guests -->
    <span class="flex items-center justify-center">
      <img src="@/assets/images/caret.svg" class="rotate-180 p-2 h-10 md:h-12 w-auto" alt="Date Previous"
        @click="getGuests = '-'" />
      <p class="text-2xl md:text-4xl text-center">{{ getGuests }}</p>
      <img src="@/assets/images/caret.svg" class="p-2 h-10 md:h-12 w-auto" alt="Date Next" @click="getGuests = '+'" />
    </span>

    <!-- Calendar -->
    <span class="flex items-center justify-center">
      <img @click="onDateChange(getDate.getTime() - 86400000)" src="@/assets/images/caret.svg" class="rotate-180 p-2 h-10 md:h-12 w-auto" alt="Date Previous" />
      <VDropdown auto>
        <p class="text-2xl md:text-4xl text-center">{{ date.toLocaleDateString('en-us', {
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
      <img @click="onDateChange(getDate.getTime() + 86400000)" src="@/assets/images/caret.svg" class="p-2 h-10 md:h-12 w-auto" alt="Date Next" />
    </span>

    <!-- Time -->
    <span class="flex items-center justify-center">
      <img src="@/assets/images/caret.svg" class="rotate-180 p-2 h-10 md:h-12 w-auto" alt="Time Previous"
         @click="onDateChange(getDate.getTime() - 1800000)" />
      <VDropdown>
        <p class="text-2xl md:text-4xl text-center">
          {{ getDate.getHours().toString().padStart(2, '0') + ":" + getDate.getMinutes().toString().padStart(2, '0') }}
        </p>
        <template #popper="{ hide }" class="w-max">
          <div class="p-5 grid grid-cols-2 gap-1 w-max">
            <button @click="onDateChange(getDate.setHours(parseInt(time.split(':')[0], parseInt(time.split(':')[1])))); hide()" v-for="time in times" class="text-sm md:text-lg font-bold font-serif disabled:opacity-20"
              :disabled="!timeAvail.find(x => x === time)">{{ time }}</button>
          </div>
        </template>
      </VDropdown>
      <img src="@/assets/images/caret.svg" class="p-2 h-10 md:h-12 w-auto" alt="Time Next"
        @click="onDateChange(getDate.getTime() + 1800000)" />
    </span>

    <!-- Personal Info -->
    <span class="flex gap-3 w-full my-2">
      <BloofInput placeholder="Title" type="radio" label="title" />
      <BloofInput class="flex-1 w-full" placeholder="Name" type="text" label="name" />
    </span>
    <BloofInput class="flex-1 w-full my-2" placeholder="E-mail" type="email" label="email" />
    <BloofInput class="flex-1 w-full my-2" placeholder="Phone" type="tel" label="phone" />
    <BloofInput class="flex-1 w-full my-2" placeholder="Purpose" type="purpose" label="purpose" :purposes="purposes"
      required />
    <BloofInput class="flex-1 w-full my-2" placeholder="Notes" type="text" label="notes" />

    <!-- Minimum Purchase -->
    <p v-if="guests >= 5"><sup>*</sup>A minimum purchase of 500k is required for this&nbsp;booking.</p>

    <!-- Submit -->
    <button class="button text-3xl my-2" type="submit" @click.prevent="submitReservation()">Submit</button>
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