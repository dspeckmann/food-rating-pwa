<script setup lang="ts">
import { Axios } from 'axios';
import { inject, onMounted, Ref, ref } from 'vue';
import Pet from '../domain/pet';
import ListRatings from '../components/ListRatings.vue'
import { useRouter } from 'vue-router';
import { useRatingStore } from '../stores/rating-store';
import ProgressBar from '../components/controls/ProgressBar.vue'

const axios = inject<Axios>('axios')
if (!axios) {
  throw new Error('Error while loading axios.')
}

const { ratings, loadRatings } = useRatingStore()
const router = useRouter()

const currentPet: Ref<Pet | undefined> = ref()
const isLoading = ref(ratings.value.length < 1)

onMounted(async () => {
  await loadRatings()
  isLoading.value = false
})

// TODO: Check if the user already has a pet in App.vue?
async function getPets() {
  // TODO: Why is the ! necessary if we check this before?
  const response = await axios!.get('/api/pets')
  const pets: Pet[] = response.data
  if (pets.length) {
    currentPet.value = pets[0]
  } else {
    router.push('/pets/add')
  }
  isLoading.value = false
}

async function petAdded(pet: Pet) {
  currentPet.value = pet
}
</script>

<template>
  <router-link
    class="button is-primary is-fullwidth is-fixed-top"
    :to="{ name: 'AddRating' }"
    id="add-rating-button">
    Futter bewerten
  </router-link>
  <h1 class="title mt-4">Letzte Bewertungen</h1>
  <ProgressBar v-if="isLoading" class="mt-4" />
  <ListRatings :ratings="ratings" v-else />
</template>
