<template>
  <section class="flex items-center justify-center fixed top-0 left-0 w-full h-full z-50">
    <dialog ref="dialog" open
      class="bg-warm-200 relative outline outline-4 outline-black w-min md:min-w-[50%] min-w-[90%] scale-0 max-h-[70%]">
      <button class="absolute top-5 right-5 z-10" @click="$emit('close')"><img class="h-6 w-auto" src="/images/x.svg"
          alt="Close Pop up" /></button>
      <div class="flex flex-col p-3 md:p-5 relative overflow-y-scroll h-min pt-6 md:pt-12 gap-3 md:gap-5">
      <div class="flex flex-col gap-1 md:gap-3 items-center">
        <div class="flex flex-col md:flex-row items-center gap-5">
          <img class="h-12 w-auto" :src="`/images/bird_${props.bird}.svg`" :alt="`bird ${props.bird}`" />
          <h2 class="text-center text-xl md:text-4xl">{{ props.title }}</h2>
        </div>
        <p v-if="props.content" class="max-w-xl" v-html="$mdRenderer.render(props.content)" />
      </div>
      <slot>
        <button class="button_pink text-xl md:text-3xl my-2 hover:scale-110 active:duration-0 active:translate-x-2 active:translate-y-2 hover:disabled:scale-100" @click="$emit('submit')">Okay</button>
      </slot>
      </div>
    </dialog>
    <div @click="$emit('close')" class="bg-warm-200 opacity-50 absolute top-0 left-0 w-full h-full -z-10" />
  </section>
</template>

<script setup lang="ts">
const { currentRoute } = useRouter();
const dialog = ref();
const main = ref();
const ctx = ref();
const { $gsap: gsap } = useNuxtApp();

const props = defineProps({
  title: String,
  content: String,
  bird: String
});

onMounted(() => {
  document.querySelector('body')!.style.overflow = 'hidden';
    ctx.value = gsap.context((self) => {
    gsap.to(dialog.value, {
      scale: 1,
      duration: 0.3
    })
  }, main.value)
})

onUnmounted(() => {
  if (currentRoute.value.path !== '/gallery') document.querySelector('body')!.style.overflow = 'initial'
  ctx.value ? ctx.value.revert() : null;
})
</script>

<style lang="scss">
dialog {
  border-top-left-radius: 321px 15px;
  border-top-right-radius: 15px 204px;
  border-bottom-right-radius: 159px 15px;
  border-bottom-left-radius: 15px 244px;
}
</style>