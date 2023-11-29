import { defineStore } from 'pinia'

export const useUIStore = defineStore('UI-store', () => {
  const loadingScreen = ref(true);
  const fetch = ref(true);
  const maps_loading = ref(true);
  const showNav = ref(false);
  const width = ref(0);
  
  const { currentRoute } = useRouter();
  
  const maps = computed(() => {
    if (!(currentRoute.value.path === '/' || currentRoute.value.path === '/contact')) return false;
    return maps_loading.value;
  })

  const nav = computed(() => {
    if (currentRoute.value.path === '/') return showNav.value;
    if (loadingScreen.value) return false;
    return true;
  })

  const fetching = computed(() => {
    if (currentRoute.value.path === '/') return fetch.value;
    return false;
  })

  const loading = computed(() => maps.value || fetching.value)

  return { fetch, fetching, loading, maps, maps_loading, loadingScreen, nav, showNav, width }
})
