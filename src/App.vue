<script setup lang="ts">
import PetOverview from './components/PetOverview.vue'
import AddPet from './components/AddPet.vue'
import { onMounted, Ref, ref } from 'vue';
import RatedFood from './domain/rated-food';
import { useAuth0 } from '@auth0/auth0-vue';
import { getPackedSettings } from 'http2';
import Pet from './domain/pet';

const { loginWithRedirect, getAccessTokenSilently, user, isAuthenticated, logout } = useAuth0()
const accessToken = ref('')

const currentPet: Ref<Pet | undefined> = ref()
const isLoading = ref(true)

onMounted(async () => {
  try {
    accessToken.value = await getAccessTokenSilently()
  } catch (e: any) {
    await loginWithRedirect()
  }

  await getPets()
})

async function getPets() {
  const response = await fetch('/api/pets', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken.value,
      'Content-Type': 'application/json'
    }
  })
  const pets: Pet[] = await response.json()
  if (pets.length) {
    currentPet.value = pets[0]
  }
  isLoading.value = false
}

async function petAdded(pet: Pet) {
  currentPet.value = pet
}
</script>

<template>
  <div class="p-4 body-wrapper">
    <div v-if="isLoading" class="progress-bar-wrapper">
      <span class="is-center">Haustiere laden...</span>
      <progress class="progress is-primary mt-4" max="100"></progress>
    </div>
    <template v-else>
      <PetOverview :pet="currentPet" v-if="currentPet" />
      <AddPet @pet-added="petAdded" v-else />
    </template>
  </div>
  <footer class="footer pb-6" v-if="isAuthenticated && user">Angemeldet als {{ user.email }}. <a @click="logout()">Logout.</a></footer>
</template>

<style scoped>
.body-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.progress-bar-wrapper {
  margin-top: auto;
  margin-bottom: auto;
  text-align: center;
}
</style>
