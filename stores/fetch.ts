import { defineStore } from 'pinia'

export const useCMSStore = defineStore('CMS-store', () => {
  const landingData = ref();
  const galleryData = ref();
  const eventsData = ref();
  const happeningsData = ref();
  const posts = ref({
    ongoing: [],
    upcoming: [],
    happy_hours: [],
    collaborations: [],
  } as {[key: string]: happening[]})
  const menuData = ref();
  const config = useRuntimeConfig();

  const numToReturn = 7;

  async function getLanding() {
    if (!landingData.value) {
      try {
         const { data } = await useFetch(`https://api.cosmicjs.com/v3/buckets/bloof-production/objects/65570bde15339469859176f9?read_key=${config.COSMIC_READ_KEY}&depth=1&props=metadata,`, {
          transform(data: landingData) {return data.object.metadata}
        });
        if (data.value) {
        landingData.value = data.value;
        } else {
          throw Error
        }
      } catch (error) {
        console.error(error)
      }
    }
    return landingData.value;
  }

async function getEvents() {
  if (!eventsData.value) {
    try{
    const { data } = await useFetch(`https://api.cosmicjs.com/v3/buckets/bloof-production/objects/65570ca615339469859176ff?read_key=${config.COSMIC_READ_KEY}&depth=1&props=slug,title,metadata,`, {
          transform(data: eventsData) {return data.object.metadata}
        });
        if (data.value) {
          eventsData.value = data.value;
        } else {
          throw Error
        }
      } catch (error) {
        console.error(error)
      }
return eventsData.value;
  }
}

async function getMenu() {
  if (!menuData.value) {
    try{
      const { data } = await useFetch(`https://api.cosmicjs.com/v3/buckets/bloof-production/objects/65570c4515339469859176fb?read_key=${config.COSMIC_READ_KEY}&depth=1&props=metadata,`, {
        transform(data: eventsData) {return data.object.metadata}
    });
      if (data.value) {
        menuData.value = data.value;
      } else {
        throw Error
      }
    } catch (error) {
      console.error(error)
    }
    return menuData.value;
  }
}

async function getHappenings() {
  if (!happeningsData.value) {
    try{
      const { data } = await useFetch(`https://api.cosmicjs.com/v3/buckets/bloof-production/objects?pretty=true&query=%7B%22type%22:%22happenings%22%7D&limit=10&read_key=${config.COSMIC_READ_KEY}&depth=1&props=slug,title,metadata,`, {
        transform(data: happeningsData) {return data.objects}
    });
    if (data.value) {
      data.value.forEach(x => {
        posts.value[x.metadata.type.key].push(x)
      })
      happeningsData.value = data.value;
    } else {
      throw Error
    }
    } catch (error) {
      console.error(error)
    }
    return happeningsData.value;
  }
}

async function getGallery() {
  if (!galleryData.value) {
    try{
      const { data } = await useFetch(`https://api.cosmicjs.com/v3/buckets/bloof-production/media?pretty=true&query=%7B%22folder%22:%22gallery%22%7D&read_key=${config.COSMIC_READ_KEY}&depth=1&props=url,imgix_url,name,`);
      if (data.value) {
        galleryData.value = data.value;
      } else {
      throw Error
    }
    } catch (error) {
      console.error(error)
    }
    return galleryData.value;
  }
}

  const getFirstRow = computed(() => {
    if (galleryData.value && galleryData.value.total >= numToReturn) {
    return galleryData.value.media.slice(0, numToReturn)
    } else if (galleryData.value) {
      const arr = galleryData.value.media
      for (let i = numToReturn; arr.length > numToReturn && i;  i--) {
        arr.push(galleryData.value.media[numToReturn - i])
      }
      return arr
    } else {
      return []
    }
  })

  const getSecondRow = computed(() => {
    if (galleryData.value && galleryData.value.total >= numToReturn * 2) {
    return galleryData.value.media.slice(numToReturn, numToReturn * 2)
    } else if (galleryData.value) {
      const arr = galleryData.value.media
      for (let i = numToReturn * 2; arr.length > numToReturn * 2 && i;  i--) {
        arr.push(galleryData.value.media[numToReturn * 2 - i])
      }
      return arr.slice(numToReturn, numToReturn * 2)
    } else {
      return []
    }
  })

  return { landingData, galleryData, eventsData, happeningsData, posts, menuData, getFirstRow, getSecondRow, getLanding, getEvents, getMenu, getHappenings, getGallery }
})
