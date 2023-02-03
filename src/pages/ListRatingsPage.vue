<script setup lang="ts">
import { Axios } from 'axios';
import { inject, onMounted, Ref, ref } from 'vue';
import Pet from '../domain/pet';
import PetOverview from '../components/PetOverview.vue'
import AddPet from '../components/AddPet.vue'
import { useRouter } from 'vue-router';

const axios = inject<Axios>('axios')
if (!axios) {
  throw new Error('Error while loading axios.')
}

const router = useRouter()

const currentPet: Ref<Pet | undefined> = ref()
const isLoading = ref(true)

onMounted(async () => {
  await getPets()
})

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
  <div v-if="isLoading" class="progress-bar-wrapper">
    <span class="is-center">Haustiere laden...</span>
    <progress class="progress is-primary mt-4" max="100"></progress>
  </div>
  <template v-else>
    <PetOverview :pet="currentPet" v-if="currentPet" />
  </template>
</template>
