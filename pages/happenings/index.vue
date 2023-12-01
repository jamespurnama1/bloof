<script setup lang="ts">
definePageMeta({
  layout: 'sub'
})

const CMSStore = useCMSStore();

onMounted(async() => {
})
</script>

<template>
  <section class="relative md:ml-[100px]">
    <Post bg="warm-200" title="Ongoing" :index="1" :posts="CMSStore.posts.ongoing" />
    <Post bg="warm-400" title="Upcoming" :index="2" :posts="CMSStore.posts.upcoming" />
    <Post bg="pink-400" title="Happy Hours" :index="3" :posts="CMSStore.posts.happy_hours" />
    <Post bg="teal-400" title="Collaborations" :index="4" :posts="CMSStore.posts.collaborations" />
  </section>
</template>