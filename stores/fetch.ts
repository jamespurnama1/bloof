import { defineStore } from 'pinia';

export const useCMSStore = defineStore('CMS-store', () => {
  const landingData = ref<LandingData | null>(null);
  const galleryData = ref<GalleryData>({ media: [] });
  const eventsData = ref<EventsData>({
    description: '',
    brochures: [],
    callToAction: '',
    moreDescription: '',
  });
  const happeningsData = ref<Happening[]>([]);
  const posts = ref<Record<string, Happening[]>>({
    ongoing: [],
    upcoming: [],
    happy_hours: [],
    collaborations: [],
  });
  const menuData = ref<MenuData>({
    subhead: '',
    coverImage: null,
    foodPages: [],
    drinkPages: [],
    breakfastPages: [],
  });
  const food = ref<(string | null)[]>([null]);
  const drinks = ref<(string | null)[]>([null]);
  const breakfast = ref<(string | null)[]>([null]);
  const food_highres = ref<(string | null)[]>([null]);
  const drinks_highres = ref<(string | null)[]>([null]);
  const breakfast_highres = ref<(string | null)[]>([null]);
  const shuffled = ref<CmsImage[]>([]);
  const client = useSanity().client;
  let loaded = false;
  let loading: Promise<void> | null = null;
  const numToReturn = 7;

  function imageUrl(image: CmsImage | null, width: number) {
    if (!image?.url) return null;
    const url = new URL(image.url);
    url.searchParams.set('w', String(width));
    url.searchParams.set('auto', 'format');
    return url.toString();
  }

  async function load() {
    if (loaded) return;
    if (loading) return loading;

    const { projectId } = client.config();
    if (!projectId || projectId === 'yourProjectId') return;

    loading = (async () => {
      try {
        const [landing, events, menu, gallery, happenings] = await Promise.all([
          client.fetch<
            | (Omit<LandingData, 'socials'> & {
                socials: { platform: string; url: string }[];
              })
            | null
          >(`*[_type == "siteSettings"][0]{
            heroImage{"url": asset->url, "assetId": asset._ref, alt},
            socials[]{platform, url},
            featuredHappening->{title, "slug": slug.current, publishedAt, category, thumbnail{"url": asset->url, "assetId": asset._ref, alt}, body},
            location{address, lat, lng},
            privateRooms{bloofBelly{"url": asset->url, "assetId": asset._ref, alt}, bloofEye{"url": asset->url, "assetId": asset._ref, alt}},
            "regulation": coalesce(regulationRich, regulation)
          }`),
          client.fetch<EventsData | null>(`*[_type == "eventsPage"][0]{
            "description": coalesce(descriptionRich, description),
            "brochures": brochures[]{"url": asset->url, "assetId": asset._ref, alt}, callToAction,
            "moreDescription": coalesce(moreDescriptionRich, moreDescription)
          }`),
          client.fetch<MenuData | null>(`*[_type == "menuPage"][0]{
            subhead, "coverImage": coverImage{"url": asset->url, "assetId": asset._ref, alt}, "pdfUrl": menuPdf.asset->url,
            "foodPages": foodPages[]{"url": asset->url, alt},
            "drinkPages": drinkPages[]{"url": asset->url, alt},
            "breakfastPages": breakfastPages[]{"url": asset->url, alt}
          }`),
          client.fetch<GalleryData | null>(`*[_type == "galleryPage"][0]{
            "media": images[]{"url": asset->url, "assetId": asset._ref, alt, "name": coalesce(alt, asset->originalFilename)}
          }`),
          client.fetch<
            Happening[]
          >(`*[_type == "happening" && defined(slug.current)] | order(publishedAt desc){
            title, "slug": slug.current, publishedAt, category,
            thumbnail{"url": asset->url, "assetId": asset._ref, alt}, "body": coalesce(bodyRich, body)
          }`),
        ]);

        landingData.value = landing
          ? {
              ...landing,
              socials: Object.fromEntries(
                (landing.socials ?? []).map(({ platform, url }) => [
                  platform,
                  url,
                ]),
              ),
            }
          : null;
        eventsData.value = events || eventsData.value;
        menuData.value = {
          ...menuData.value,
          ...(menu || {}),
          foodPages: menu?.foodPages ?? [],
          drinkPages: menu?.drinkPages ?? [],
          breakfastPages: menu?.breakfastPages ?? [],
        };
        galleryData.value = { media: gallery?.media ?? [] };
        const happeningItems = happenings ?? [];
        happeningsData.value = happeningItems;
        posts.value = {
          ongoing: happeningItems.filter((post) => post.category === 'ongoing'),
          upcoming: happeningItems.filter(
            (post) => post.category === 'upcoming',
          ),
          happy_hours: happeningItems.filter(
            (post) => post.category === 'happy_hours',
          ),
          collaborations: happeningItems.filter(
            (post) => post.category === 'collaborations',
          ),
        };
        shuffled.value = [...galleryData.value.media].sort(
          () => Math.random() - 0.5,
        );

        food.value = [
          null,
          ...menuData.value.foodPages.map((image) => imageUrl(image, 1080)),
        ];
        food_highres.value = [
          null,
          ...menuData.value.foodPages.map((image) => imageUrl(image, 1920)),
        ];
        drinks.value = [
          null,
          ...menuData.value.drinkPages.map((image) => imageUrl(image, 1080)),
        ];
        drinks_highres.value = [
          null,
          ...menuData.value.drinkPages.map((image) => imageUrl(image, 1920)),
        ];
        breakfast.value = [
          null,
          ...menuData.value.breakfastPages.map((image) =>
            imageUrl(image, 1080),
          ),
        ];
        breakfast_highres.value = [
          null,
          ...menuData.value.breakfastPages.map((image) =>
            imageUrl(image, 1920),
          ),
        ];
        loaded = true;
      } catch (error) {
        console.error('Unable to load Sanity content', error);
      } finally {
        loading = null;
      }
    })();

    return loading;
  }

  const getFirstRow = computed(() => shuffled.value.slice(0, numToReturn));
  const getSecondRow = computed(() =>
    shuffled.value.slice(numToReturn, numToReturn * 2),
  );

  return {
    landingData,
    galleryData,
    eventsData,
    happeningsData,
    posts,
    menuData,
    getFirstRow,
    getSecondRow,
    food,
    food_highres,
    drinks,
    drinks_highres,
    breakfast,
    breakfast_highres,
    shuffled,
    load,
  };
});
