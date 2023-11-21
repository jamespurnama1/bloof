import { defineStore } from 'pinia'

export const useCMSStore = defineStore('CMS-store', () => {
  const landingData = ref();
  const galleryData = ref()
  const eventsData = ref()
  const happeningsData = ref()
  const menuData = ref()

  const numToReturn = 7;

  const getFirstRow = computed(() => {
    if (galleryData.value.total >= numToReturn) {
    return galleryData.value.media.slice(0, numToReturn)
    } else {
      const arr = galleryData.value.media
      for (let i = numToReturn; arr.length > numToReturn && i;  i--) {
        arr.push(galleryData.value.media[numToReturn - i])
      }
      return arr
    }
  })
  const getSecondRow = computed(() => {
    if (galleryData.value.total >= numToReturn * 2) {
    return galleryData.value.media.slice(numToReturn, numToReturn * 2)
    } else {
      const arr = galleryData.value.media
      for (let i = numToReturn * 2; arr.length > numToReturn * 2 && i;  i--) {
        arr.push(galleryData.value.media[numToReturn * 2 - i])
      }
      return arr.slice(numToReturn, numToReturn * 2)
    }
  })

  return { landingData, galleryData, eventsData, happeningsData, menuData, getFirstRow, getSecondRow }
})
