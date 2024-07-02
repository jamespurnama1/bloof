import { defineStore } from 'pinia'

export const useFormStore = defineStore('form-store', () => {
  const name = ref();
  const title = ref();
  const email = ref();
  const phone = ref();
  const notes = ref();
  const date = ref();
  const dateAvailability = ref();
  const guests = ref(1);
  const purpose = ref();

function reset() {
  name.value = ''
  title.value = ''
  email.value = ''
  phone.value = null
  notes.value = ''
  date.value = null
  dateAvailability.value = null
  guests.value = 1
  purpose.value = ''
}

  const purposeIsValid = computed(() => {
    return Boolean(purpose.value && purpose.value.length);
  })

const nameIsValid = computed(() => {
  if (name.value && name.value.length <= 2) return false
  return new RegExp(/^[a-z]/, 'i').test(name.value)
})

  const emailIsValid = computed(() => {
    if (!email.value) return false;
    return new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/).test(email.value)
  })

  const phoneIsValid = computed(() => {
    if (!(phone.value && phone.value.length)) return false;
    return new RegExp(/^([0-9](?!\D)){9,16}$/, "i").test(phone.value);
  })

  const titleIsValid = computed(() => {
    const values = ['Mr.', 'Ms.', 'Mrs.']
    return Boolean(values.find(x => x === title.value));
  })
  const guestIsValid = computed(() => {
    return (guests.value > 0 && guests.value <= 10);
  })

  const dateIsValid = computed(() => {
    return (new Date(Date.now()).getTime() + 3600000 < date.value && date.value < new Date(Date.now()).getTime() + 2629800000 && dateAvailability.value)
  })

  const valid = computed(() => {
    return Boolean(nameIsValid.value && titleIsValid.value && emailIsValid.value && phoneIsValid.value && dateIsValid.value && guestIsValid.value && purposeIsValid.value);
  })

  const getTime = computed(() => {
    if (!date.value) return;
    return date.value.getHours().toString().padStart(2, '0') + ":" + date.value.getMinutes().toString().padStart(2, '0')
  })

  const getDate = computed(() => {
    if (!date.value) return;
    return date.value.toISOString().substring(0, 10)
  })

  // Event
  const pax = ref('>50');
  const budget = ref('100k');

  const paxIsValid = computed(() => {
    const arr = ['>50', '50-100', '100-150'];
    return arr.some(x => x === pax.value);
  })

  const budgetIsValid = computed(() => {
    const arr = ['100k', '100k-200k', '200k<'];
    return arr.some(x => x === budget.value);
  })


  const eventValid = computed(() => {
    return Boolean(nameIsValid.value && emailIsValid.value && phoneIsValid.value && dateIsValid.value && paxIsValid.value && budgetIsValid.value);
  })

  return {reset, name, title, email, phone, notes, date, dateAvailability, guests, purpose, valid, getTime, getDate, phoneIsValid, dateIsValid, emailIsValid, nameIsValid, titleIsValid, purposeIsValid, guestIsValid, eventValid, budgetIsValid, paxIsValid, pax, budget}
})
