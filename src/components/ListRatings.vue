<script setup lang="ts">
import Camera from 'simple-vue-camera'
import RatedFood from '../domain/rated-food';
import Rating from '../domain/rating';

defineProps<{ ratings: Array<RatedFood> }>()

// TODO: Add computed for ordered ratings (by date)

function getPictureUrl(picture: Blob) {
  return URL.createObjectURL(picture)
}
</script>

<template>
  <h1 class="title mt-4" v-if="ratings.length">Bewertungen</h1>
  <p class="mt-4" v-else>Du hast noch kein Futter bewertet.</p>
  <div class="card mb-4" v-for="ratedFood of ratings">
    <div class="card-image">
      <figure class="image is-square">
        <img :src="getPictureUrl(ratedFood.picture)">
      </figure>
    </div>
    <div class="card-content">
      <div class="content">
        <span v-if="ratedFood.rating == Rating.Bad">😾</span>
        <span v-if="ratedFood.rating == Rating.Medium">😺</span>
        <span v-if="ratedFood.rating == Rating.Good">😻</span>
        <time :datetime="ratedFood.date.toISOString()" class="is-pulled-right">{{ratedFood.date.toLocaleDateString()}}</time>
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
