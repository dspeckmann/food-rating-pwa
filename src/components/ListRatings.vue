<script setup lang="ts">
import { computed } from 'vue';
import Rating from '../domain/rating'
import Taste from '../domain/taste'

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
  <div class="card mb-4" v-for="foodRating of orderedRatings">
    <div class="card-image">
      <figure class="image is-square">
        <img :src="foodRating.pictureDataString">
      </figure>
    </div>
    <div class="card-content">
      <div class="content">
        <span v-if="foodRating.taste == Taste.Bad">😾</span>
        <span v-if="foodRating.taste == Taste.Medium">😺</span>
        <span v-if="foodRating.taste == Taste.Good">😻</span>
        <time class="is-pulled-right">{{ formatDate(foodRating) }}</time>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rated-food-tile {
  background-color: rgba(0, 0, 0, 0.2);
}
.rated-food-card {
  margin: auto;
  width: 250px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
}

.rated-food-card span {
  font-size: 4rem;
}
</style>
