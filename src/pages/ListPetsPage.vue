<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AddPetPrompt from '../components/AddPetPrompt.vue'
import { usePetStore } from '../stores/pet-store';

const { pets, loadPets, isLoading } = usePetStore()

onMounted(async () => {
  await loadPets()
})
</script>

<template>
  <template v-if="pets.length">
    <!-- TODO: Order by updatedAt -->
    <router-link v-for="pet of pets" :to="{ name: 'EditPet', params: { id: pet.id }}">
      <div class="card mb-4">
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
    <router-link class="button is-primary" to="/pets/add">Weiteres Haustier hinzufügen</router-link>
  </template>
  <AddPetPrompt v-else />
</template>
