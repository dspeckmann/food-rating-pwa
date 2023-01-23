<script setup lang="ts">
import { Axios } from 'axios';
import { inject, onMounted, Ref, ref } from 'vue';
import Pet from '../domain/pet';
import AddPetPrompt from '../components/AddPetPrompt.vue'

const axios = inject<Axios>('axios')
if (!axios) {
  throw new Error('Error while loading axios.')
}

const pets: Ref<Pet[]> = ref([])
const isLoading = ref(true)

onMounted(async () => {
  const response = await axios.get('/pets/')
  pets.value = response.data
  isLoading.value = false
})
</script>

<template>
  <template v-for="pet of pets" v-if="pets.length">
    <router-link :to="{ name: 'EditPet', params: { id: pet.id }}">
      <div class="card mb-4" v-for="pet of pets" v-if="pets.length">
        <div class="card-image">
          <figure class="image is-square">
            <img /> <!-- TODO: Add picture-->
          </figure>
        </div>
        <div class="card-content">
          <div class="content">{{ pet.name }}</div>
        </div>
      </div>
    </router-link>
  </template>
  <AddPetPrompt v-else />
</template>
