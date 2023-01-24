<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePetStore } from '../stores/pet-store';

const router = useRouter()
const { addPet, isLoading } = usePetStore()
const petName = ref('')

async function save() {
  await addPet({ id: '', name: petName.value })
  router.back()
}
</script>

<template>
  <label for="pet-name">Name:</label>
  <div class="control my-4" :class="{ 'is-loading': isLoading }">
    <input type="text" class="input" name="pet-name" v-model="petName" :disabled="isLoading" />
  </div>
  <button class="button is-success is-pulled-right" @click="save">Fertig</button>
  <button class="button is-pulled-right mr-2" @click="router.back()">Abbrechen</button>
</template>
