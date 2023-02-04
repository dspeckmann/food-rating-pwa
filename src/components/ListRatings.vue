<script setup lang="ts">
import { computed } from 'vue';
import Rating from '../domain/rating'
import RatingCard from '../components/RatingCard.vue'

const props = defineProps<{ ratings: Array<Rating> }>()

function formatDate(rating: Rating): string {
  const date = new Date(rating.createdAt)
  return date.toLocaleDateString()
}

const orderedRatings = computed(() => {
  return props.ratings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})
</script>

<template>
  <p class="mt-4" v-if="ratings.length < 1">Du hast noch kein Futter bewertet.</p>
  <RatingCard class="mb-4" v-for="rating of orderedRatings" :rating="rating"></RatingCard>
</template>

<style scoped>
</style>
