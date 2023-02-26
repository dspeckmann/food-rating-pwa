<script setup lang="ts">
import { computed, onMounted } from 'vue';
import AddPetPrompt from '../components/AddPetPrompt.vue'
import { usePetStore } from '../stores/pet-store'
import PetCard from '../components/PetCard.vue'

const { pets, loadPets } = usePetStore()

const orderedPets = computed(() => {
  return pets.value.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

onMounted(async () => {
  await loadPets()
})
</script>

<template>
  <template v-if="pets.length">
    <router-link v-for="pet of orderedPets" :to="{ name: 'ViewPet', params: { id: pet.id }}">
      <PetCard :pet="pet" />
    </router-link>
    <router-link class="button is-primary is-fullwidth" to="/pets/add">Weiteres Haustier hinzufügen</router-link>
  </template>
  <AddPetPrompt v-else />
</template>
