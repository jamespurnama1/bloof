import { defineStore } from 'pinia'

export const useFormStore = defineStore('form-store', () => {
  const name = ref();
  const title = ref();
  const email = ref();
  const phone = ref();
  const notes = ref();
  const date = ref();
  const guests = ref(1);
  const purpose = ref();

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
    //   // if hours available
//   // set minimum 1 hour from now
//   // if hours not available
//   // set maximum 1 month from now
//   // none are available
    return true;
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

  return {name, title, email, phone, notes, date, guests, purpose, valid, getTime, getDate, phoneIsValid, dateIsValid, emailIsValid, nameIsValid, titleIsValid, purposeIsValid, guestIsValid}
})
