<script setup lang="ts">
import { ref } from 'vue'
import Camera from 'simple-vue-camera'
import Rating from '../domain/rating';
import { useAuth0 } from '@auth0/auth0-vue';
import Pet from '../domain/pet';

const { getAccessTokenSilently } = useAuth0()

const emit = defineEmits(['petAdded'])

const petName = ref('')
const isLoading = ref(false)

async function addPet() {
    if (petName) {
        isLoading.value = true
        const accessToken = await getAccessTokenSilently()
        const response = await fetch('/api/pets', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + accessToken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: petName.value })
        })
        const pet: Pet = await response.json()
        isLoading.value = false
        emit('petAdded', pet)
    }
}
</script>

<template>
    <h1 class="title">Haustier hinzufügen</h1>
  <label for="pet-name">Name:</label>
  <div class="control my-4" :class="{ 'is-loading': isLoading }">
    <input type="text" class="input" name="pet-name" v-model="petName" :disabled="isLoading" />
  </div>
  <button class="button is-primary is-pulled-right" @click="addPet()">Fertig</button>
</template>

<style scoped>
</style>
