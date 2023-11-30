<template>
  <NuxtLayout>
    <Cursor v-if="width > 768" />
    <div class="flex flex-col items-center justify-center h-screen bg-pink-200">
      <img class="h-32 md:h-64" src="/images/bird_thank.svg" alt="Bird Sorry" />
      <h1 class="text-center text-5xl md:text-9xl">{{ message }}</h1>
      <p v-if="error">
        <strong class="font-normal">{{ error.statusCode }} {{ error.statusMessage.split(':')[0] }}</strong>
      </p>
      <button
        class="button_teal my-8 text-3xl hover:scale-110 active:duration-0 active:translate-x-2 active:translate-y-2"
        @click="handleError()">Home</button>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const props = defineProps({
  error: Object
})

const handleError = () => {
  clearError()
  location.href = '/'
}

const message = computed(() => props.error && props.error.statusCode === 404 ? 'Where is it?' : 'Something went wrong...')

const UIStore = useUIStore();
const width = ref(0);

function updateWidth() {
  width.value = window.innerWidth;
  UIStore.width = width.value;
};

onMounted(() => {
  window.addEventListener('resize', updateWidth);
  updateWidth();
});
</script>