<template>
  <div class="flex w-full md:pl-[100px] pt-24">
    <NuxtLink to="/happenings" class="px-3 md:px-10 pt-4 md:pt-12 -mr-24 md:mr-0"><img src="/images/arrow.svg" alt="Go Back" class="rotate-90 h-8 md:h-12" />Go
      back</NuxtLink>
    <div v-if="post" class="flex-1">
      <header class="flex pl-24 w-full flex-col md:pl-0">
        <h1 class="text-4xl md:text-9xl text-left">{{ post.title }}</h1>
        <h2  class="bordered w-min whitespace-nowrap bg-teal-400 p-2 my-2 text-xs font-sans">{{ post.metadata.type.value }}</h2>
      </header>
      <main class="">
        <article class="pt-4 md:pt-12 min-h-[50dvh] md:max-w-2xl px-8 md:px-0 w-full">
          <p class="" v-html="$mdRenderer.render(post.metadata.post)" />
        </article>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const CMSStore = useCMSStore()
const post = ref();

post.value = CMSStore.happeningsData.find(x => x.slug === route.params.id);
if (!post.value) {
  throw createError({
    statusCode: 404
  });
};
</script>

<style scoped lang="scss">
.bordered {
  border-top-left-radius: 331px 15px;
  border-top-right-radius: 15px 278px;
  border-bottom-right-radius: 245px 15px;
  border-bottom-left-radius: 15px 301px;
  @apply outline-4 outline outline-black
}
</style>