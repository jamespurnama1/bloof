<template>
  <div class="flex w-full md:pl-[100px] pt-24">
    <NuxtLink to="/happenings" class="px-3 md:px-10 pt-4 md:pt-12 -mr-24 md:mr-0"><img src="/images/arrow.png"
        alt="Go Back" class="rotate-90 h-8 md:h-12" />Go
      back</NuxtLink>
    <div v-if="post" class="flex-1">
      <header class="flex pl-24 w-full flex-col md:pl-0">
        <h1 class="text-4xl md:text-9xl text-left">{{ post.title }}</h1>
        <div class="flex items-center gap-5">
          <h2 class="bordered w-min whitespace-nowrap bg-teal-400 p-2 my-2 text-xs font-sans">{{ post.metadata.type.value
          }}
          </h2>
          <time :datetime="post.published_at">{{ new Date(post.published_at).toLocaleDateString() }}</time>
        </div>
      </header>
      <main>
        <article class="pt-4 md:pt-12 md:max-w-2xl px-8 md:px-0 w-full">
          <NuxtPicture preload provider="imgix" :imgAttrs="{ class: 'object-cover' }"
            :src="post.metadata.thumbnail.imgix_url.replace('https://imgix.cosmicjs.com', '')" :alt="post.title"
            densities="x1 x2" sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw"
            :placeholder="[50, 25, 75, 5]" />
          <br>
          <p v-html="article" />
        </article>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const CMSStore = useCMSStore()
const post = ref();
const { $mdRenderer } = useNuxtApp()

post.value = CMSStore.happeningsData.find(x => x.slug === route.params.id);
const article = ref('')

if (!post.value) {
  throw createError({
    statusCode: 404
  });
};

onMounted(() => {
  article.value = $mdRenderer.render(post.value.metadata.post);
})
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