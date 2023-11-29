<template>
  <span class="w-full" :class="`bg-${bg}`"><h2 class="text-7xl">{{ title }}</h2></span>
  <div class="overflow-x-scroll">
    <div class="h-full" v-for="post in posts">
      <h3>{{ post.title }}</h3>
      <img :src="post.image" :alt="post.title" />
    </div>
    <img src="" alt="Bloof Pattern">
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  bg: string
  index: number
  posts: {
    image: string
    title: string
  }[]
}>()
</script>
