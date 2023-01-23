



  <script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import FoodRating from '../domain/food-rating';
import Pet from '../domain/pet';
import ListRatings from './ListRatings.vue'
import AddRating from './AddRating.vue'
import { Axios } from 'axios';

const props = defineProps<{ pet: Pet }>()

const axios = inject<Axios>('axios')
if (!axios) {
  throw new Error('Error while loading axios.')
}

const addingRating = ref(false)
const ratings = ref(new Array<FoodRating>())
const isLoading = ref(true)

onMounted(async () => {
  const response = await axios.get(`/pets/${props.pet.id}/ratings`)
  ratings.value = response.data
  isLoading.value = false
})

function addRating() {
  addingRating.value = true
}

function ratingAdded(newRating: FoodRating) {
  ratings.value.push(newRating)
  addingRating.value = false
}

function ratingCancelled() {
  addingRating.value = false
}
</script>

<template>
  <button
    v-if="!addingRating"
    class="button is-primary is-fullwidth is-fixed-top"
    :class="{ 'is-loading': isLoading }" 
    :disabled="isLoading"
    @click="addRating"
    id="add-rating-button">
    Neues Futter bewerten
  </button>
  <AddRating v-if="addingRating" @rating-added="ratingAdded" @cancelled="ratingCancelled" :pet="pet" />
  <template v-else>
    <h1 class="title mt-4">Bewertungen für {{ pet.name }}</h1>
    <p v-if="isLoading">Lade Bewertungen...</p>
    <ListRatings :ratings="ratings" v-else />
    </template>
</template>

<style scoped>
</style>
