<script setup lang="ts">
import ListRatings from './components/ListRatings.vue'
import AddRating from './components/AddRating.vue'
import { ref } from 'vue';
import RatedFood from './domain/rated-food';

const addingRating = ref(false)
const ratings = ref(new Array<RatedFood>())

function addRating() {
  addingRating.value = true
}

function ratingAdded(newRating: RatedFood) {
  ratings.value.push(newRating)
  addingRating.value = false
}

function ratingCancelled() {
  addingRating.value = false
}
</script>

<template>
  <nav class="navbar is-fixed-top p-4" v-if="!addingRating">
    <button class="button is-primary is-fullwidth is-fixed-top" @click="addRating" id="add-rating-button">Neues Futter bewerten</button>
  </nav>
  <div class="p-4">
    <AddRating v-if="addingRating" @rating-added="ratingAdded" @cancelled="ratingCancelled" />
    <ListRatings :ratings="ratings" v-else />
  </div>
</template>

<style scoped>
</style>
