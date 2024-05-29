import type { AsyncData } from 'nuxt/app';
import { defineStore } from 'pinia'

export const useCMSStore = defineStore('CMS-store', () => {
  const landingData = ref() as Ref<landingData>;
  const galleryData = ref()  as Ref<photosData>;
  const eventsData = ref() as Ref<eventsData>;
  const happeningsData = ref() as Ref<happening[]>;
  const posts = ref({
    ongoing: [],
    upcoming: [],
    happy_hours: [],
    collaborations: [],
  } as {[key: string]: happening[]})
  const menuData = ref();
  const config = useRuntimeConfig();
  const food = ref([null] as (URL | null)[])
  const drinks = ref([null] as (URL | null)[])
  const breakfast = ref([null] as (URL | null)[])
  const food_highres = ref([null] as (URL | null)[])
  const drinks_highres = ref([null] as (URL | null)[])
  const breakfast_highres = ref([null] as (URL | null)[])
  const shuffled = ref([] as media[])
  const numToReturn = 7;

  async function getLanding() {
    if (!landingData.value) {
      try {
         const { data } = await useFetch(`https://api.cosmicjs.com/v3/buckets/bloof-production/objects/65570bde15339469859176f9?read_key=${config.COSMIC_READ_KEY}&depth=1&props=metadata,`, {
          transform(data: {object: { metadata: landingData}}) {return data.object.metadata}
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
          transform(data: {object: { metadata: eventsData}}) {return data.object.metadata}
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
        transform(data: {object: { metadata: menuData}}) {return data.object.metadata}
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
      const { data } = await useFetch(`https://api.cosmicjs.com/v3/buckets/bloof-production/objects?pretty=true&query=%7B%22type%22:%22happenings%22%7D&read_key=${config.COSMIC_READ_KEY}&depth=1&props=slug,title,metadata,published_at,`, {
        transform(data: happeningsData) { return data.objects }
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
      const { data } = await useFetch(`https://api.cosmicjs.com/v3/buckets/bloof-production/media?pretty=true&query=%7B%22folder%22:%22gallery%22%7D&read_key=${config.COSMIC_READ_KEY}&depth=1&props=url,imgix_url,name,metadata`);
      if (data.value) {
        galleryData.value = data.value as photosData;
        shuffled.value = galleryData.value && galleryData.value.media.length ? [...galleryData.value.media.sort(() => 0.5 - Math.random())] : [];
      } else {
      throw Error
    }
    } catch (error) {
      console.error(error)
    }
    return galleryData.value;
  }
}

async function getFood() {
  if (food.value.length <= 1) {
    try{
      const { data } = await useFetch(`https://api.cosmicjs.com/v3/buckets/bloof-production/media?pretty=true&query=%7B%22folder%22:%22food%22%7D&read_key=${config.COSMIC_READ_KEY}&depth=1&props=imgix_url,original_name,`) as AsyncData<photosData, Error>;
      if (data.value) {
        data.value.media.sort((a, b) => {
          // faster than localCompare()
          // a.original_name?.localeCompare(b.original_name as string)
          return (a.original_name! < b.original_name! ? -1 : (a.original_name! > b.original_name! ? 1 : 0));
        });
        food.value = data.value.media.map(x => {
          return `${x.imgix_url}?w=1080&fm=webp` as unknown as URL
        })
        food_highres.value = (data.value as photosData).media.map(x => {
          return `${x.imgix_url}?w=1920&fm=webp` as unknown as URL
        })
        food.value.unshift(null)
        food_highres.value.unshift(null)
      } else {
      throw Error
    }
    } catch (error) {
      console.error(error)
    }
    return food.value;
  }
}

async function getDrinks() {
  if (drinks.value.length <= 1) {
    try{
      const { data } = await useFetch(`https://api.cosmicjs.com/v3/buckets/bloof-production/media?pretty=true&query=%7B%22folder%22:%22drinks%22%7D&read_key=${config.COSMIC_READ_KEY}&depth=1&props=imgix_url,original_name,`) as AsyncData<photosData, Error>;
      if (data.value) {
        data.value.media.sort((a, b) => {
          // faster than localCompare()
          // a.original_name?.localeCompare(b.original_name as string)
          return (a.original_name! < b.original_name! ? -1 : (a.original_name! > b.original_name! ? 1 : 0));
        });
        drinks.value = (data.value as photosData).media.map(x => {
          return `${x.imgix_url}?w=1080&fm=webp` as unknown as URL
        })
        drinks_highres.value = (data.value as photosData).media.map(x => {
          return `${x.imgix_url}?w=1920&fm=webp` as unknown as URL
        })
        drinks.value.unshift(null)
        drinks_highres.value.unshift(null)
      } else {
      throw Error
    }
    } catch (error) {
      console.error(error)
    }
    return drinks.value;
  }
}

async function getBreakfast() {
  if (breakfast.value.length <= 1) {
    try{
      const { data } = await useFetch(`https://api.cosmicjs.com/v3/buckets/bloof-production/media?pretty=true&query=%7B%22folder%22:%22breakfast%22%7D&read_key=${config.COSMIC_READ_KEY}&depth=1&props=imgix_url,original_name,`) as AsyncData<photosData, Error>;
      if (data.value) {
        data.value.media.sort((a, b) => {
          // faster than localCompare()
          // a.original_name?.localeCompare(b.original_name as string)
          return (a.original_name! < b.original_name! ? -1 : (a.original_name! > b.original_name! ? 1 : 0));
        });
        breakfast.value = (data.value as photosData).media.map(x => {
          return `${x.imgix_url}?w=1080&fm=webp` as unknown as URL
        })
        breakfast_highres.value = (data.value as photosData).media.map(x => {
          return `${x.imgix_url}?w=1920&fm=webp` as unknown as URL
        })
        breakfast.value.unshift(null)
        breakfast_highres.value.unshift(null)
      } else {
      throw Error
    }
    } catch (error) {
      console.error(error)
    }
    return breakfast.value;
  }
}

  const getFirstRow = computed(() => {
    if (shuffled.value && shuffled.value.length >= numToReturn) {
      return shuffled.value.slice(0, numToReturn)
    } else if (shuffled) {
      const arr = shuffled.value
      for (let i = numToReturn; arr.length > numToReturn && i;  i--) {
        arr.push(shuffled.value[numToReturn - i])
      }
      return arr
    } else {
      return []
    }
  })

  const getSecondRow = computed(() => {
    if (shuffled && shuffled.value.length >= numToReturn * 2) {
    return shuffled.value.slice(numToReturn, numToReturn * 2)
    } else if (shuffled) {
      const arr = shuffled.value
      for (let i = numToReturn * 2; arr.length > numToReturn * 2 && i;  i--) {
        arr.push(shuffled.value[numToReturn * 2 - i])
      }
      return arr.slice(numToReturn, numToReturn * 2)
    } else {
      return []
    }
  })

  return { landingData, galleryData, eventsData, happeningsData, posts, menuData, getFirstRow, getSecondRow, food, food_highres, drinks, drinks_highres, breakfast, breakfast_highres, shuffled, getLanding, getEvents, getMenu, getHappenings, getGallery, getFood, getDrinks, getBreakfast }
})
