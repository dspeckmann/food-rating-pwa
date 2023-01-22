



  <script setup lang="ts">
import { onMounted, ref } from 'vue'
import RatedFood from '../domain/rated-food';
import Rating from '../domain/rating';
import { useAuth0 } from '@auth0/auth0-vue';
import FoodRating from '../domain/food-rating';
import Pet from '../domain/pet';
import ListRatings from './ListRatings.vue'
import AddRating from './AddRating.vue'

const props = defineProps<{ pet: Pet }>()

const { getAccessTokenSilently } = useAuth0()

const addingRating = ref(false)
const ratings = ref(new Array<FoodRating>())
const isLoading = ref(true)

onMounted(async () => {
  const accessToken = await getAccessTokenSilently()
  const response = await fetch(`/api/pets/${props.pet.id}/ratings`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  })
  ratings.value = await response.json()
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
  <nav class="navbar is-fixed-top p-4" v-if="!addingRating">
    <button
      class="button is-primary is-fullwidth is-fixed-top"
      :class="{ 'is-loading': isLoading }" 
      :disabled="isLoading"
      @click="addRating"
      id="add-rating-button">
      Neues Futter bewerten
    </button>
  </nav>
  <AddRating v-if="addingRating" @rating-added="ratingAdded" @cancelled="ratingCancelled" :pet="pet" />
  <template v-else>
    <h1 class="title mt-4">Bewertungen für {{ pet.name }}</h1>
    <p v-if="isLoading">Lade Bewertungen...</p>
    <ListRatings :ratings="ratings" v-else />
    </template>
</template>

<style scoped>
</style>
