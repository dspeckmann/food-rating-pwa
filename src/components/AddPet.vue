<script setup lang="ts">
import { inject, ref } from 'vue'
import Pet from '../domain/pet';
import { Axios } from 'axios';

const emit = defineEmits(['petAdded'])

const axios = inject<Axios>('axios')
if (!axios) {
  throw new Error('Error while loading axios.')
}

const petName = ref('')
const isLoading = ref(false)

async function addPet() {
    if (petName) {
        isLoading.value = true
        const response = await axios!.post('/pets', { name: petName.value })
        const pet: Pet = response.data
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
