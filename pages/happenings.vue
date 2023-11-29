<script setup lang="ts">
definePageMeta({
  layout: 'sub'
})

onMounted(async() => {
})
</script>

<template>
  <section class="">
    <Post bg="warm-200" title="Ongoing" :index="1" :posts="[{image: '', title: 'asdasd'}]" />
    <Post bg="warm-400" title="Upcoming" :index="2" :posts="[{ image: '', title: 'asdasd' }]" />
    <Post bg="pink-400" title="Happy Hours" :index="3" :posts="[{ image: '', title: 'asdasd' }]" />
    <Post bg="teal-400" title="Collaborations" :index="4" :posts="[{ image: '', title: 'asdasd' }]" />
  </section>
</template>