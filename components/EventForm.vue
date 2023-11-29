<template>
  <Pop v-if="submitted && modal" @close="modal = false" @submit="modal = false" title="We'll get in touch with you!"
    content="" bird="thank" />
  <Transition name="fade">
    <form v-if="!submitted"
      class="flex flex-col max-w-2xl md:max-w-none items-center justify-center gap-5 md:gap-12 md:w-3/4">
      <div class="flex items-center justify-center gap-5 md:gap-16 flex-col md:flex-row md:w-full">
        <div class="flex items-center justify-center flex-col gap-3">
          <BloofInput class="flex-1 w-full" placeholder="Name" type="text" label="name" />
          <BloofInput class="flex-1 w-full my-2" placeholder="Phone" type="tel" label="phone" />
          <BloofInput class="flex-1 w-full my-2" placeholder="E-mail" type="email" label="email" />
          <BloofInput class="flex-1 w-full my-2" placeholder="Notes" type="text" label="notes" />
        </div>
        <div class="flex flex-col items-center justify-center">
          <!-- Calendar -->
          <p class="text-center font-sans font-normal text-sm mt-3">Event Date</p>
          <span class="flex items-center justify-center">
            <img @click="onDateChange(getDate.getTime() - 86400000)" src="/images/caret.svg"
              class="rotate-180 p-2 h-10 md:h-12 w-auto" alt="Date Previous" />
            <VDropdown auto>
              <p class="text-2xl md:text-4xl text-center">{{ date.toLocaleDateString('en-us', {
                weekday:
                  "long", month: "short", day: "numeric"
              }) }}</p>
              <template #popper="{ hide }">
                <ClientOnly>
                  <VCalendar v-model="getDate" :locale="{ id: 'en', firstDayOfWeek: 1 }" :attributes="attributes"
                    borderless trim-weeks @dayclick="(e) => { onDateChange(e.date); hide() }"
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
            <img @click="onDateChange(getDate.getTime() + 86400000)" src="/images/caret.svg"
              class="p-2 h-10 md:h-12 w-auto" alt="Date Next" />
          </span>

          <!-- Guests -->
          <p class="text-center font-sans font-normal text-sm mt-3">No. of guests</p>
          <span class="flex items-center justify-center">
            <img src="/images/caret.svg" class="rotate-180 p-2 h-10 md:h-12 w-auto" alt="Number of Guests Prev"
              @click="paxSelected ? paxSelected-- : paxSelected = pax.length - 1" />
            <p class="text-2xl md:text-4xl text-center">{{ pax[paxSelected] }} pax</p>
            <img src="/images/caret.svg" class="p-2 h-10 md:h-12 w-auto" alt="Number of Guests Next"
              @click="paxSelected === pax.length - 1 ? paxSelected = 0 : paxSelected++" />
          </span>

          <!-- Budget -->
          <p class="text-center font-sans font-normal text-sm mt-3">Budget per guest</p>
          <span class="flex items-center justify-center">
            <img src="/images/caret.svg" class="rotate-180 p-2 h-10 md:h-12 w-auto" alt="Number of Guests Prev"
              @click="budgetSelected ? budgetSelected-- : budgetSelected = budget.length - 1" />
            <p class="text-2xl md:text-4xl text-center">{{ budget[budgetSelected] }}</p>
            <img src="/images/caret.svg" class="p-2 h-10 md:h-12 w-auto" alt="Number of Guests Next"
              @click="budgetSelected === budget.length - 1 ? budgetSelected = 0 : budgetSelected++" />
          </span>
        </div>
      </div>
      <p v-if="tried && !formStore.eventValid" class="bg-pink-400 p-2 outline-4 outline">Please fill the
        form&nbsp;correctly.</p>
      <!-- Submit -->
      <button
        class="button text-3xl my-2 hover:scale-110 active:duration-0 active:translate-x-2 active:translate-y-2 disabled:opacity-50 hover:disabled:scale-100"
        type="submit" :disabled="tried && !formStore.eventValid"
        @click.prevent="formStore.eventValid ? handleSubmit() : tried = true">Submit</button>
    </form>
    <h3 v-else class="text-3xl md:text-5xl text-center">We can't wait to have this event with you!</h3>
  </Transition>
</template>

<script setup lang="ts">
const submitted = ref(false);
const modal = ref(false);
const tried = ref(false);
const pax = ['>50', '50-100', '100-150'];
const paxSelected = ref(0);
const budget = ['100k', '100k-200k', '200k<'];
const budgetSelected = ref(0);
const formStore = useFormStore();
const date = ref(new Date(new Date(Date.now()).setHours(new Date().getHours() + 1)));
const attributes = ref(
  [{
    highlight: true,
    dates: date.value,
  }]);
// 3 months
const maxDate = new Date(Date.now()).getTime() + (2629800000 * 3);
// 1 hour -> 1 week
const minDate = new Date(Date.now()).getTime() + 3600000;

formStore.reset()

// Calendar

const getDate = computed({
  get() {
    return date.value
  },
  set(val) {
    let computedVal = val.getTime();
    // reset time to 17:00 if more than 1 day
    if (Math.abs(computedVal - date.value.getTime()) >= 86400000) {
      computedVal = new Date(computedVal).setHours(17, 0);
    }
    // set minimum 1 hour from now. set maximum 1 month from now
    computedVal = Math.max(minDate, Math.min(maxDate, computedVal))

    // increments of 30 minutes
    computedVal = Math.floor(computedVal / 1800000) * 1800000;

    date.value = new Date(computedVal);
    formStore.date = date.value;
  }
  // if hours available
  // none are available
})

function onDateChange(date: Date | number) {
  if (typeof date === 'number') {
    getDate.value = new Date(date);
  } else {
    getDate.value = date;
  }
}

onDateChange(new Date(Date.now()));

function handleSubmit() {
  modal.value = true;
  submitted.value = true;
}

</script>