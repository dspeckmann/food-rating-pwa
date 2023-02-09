<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePetStore } from '../stores/pet-store'

const props = defineProps<{ id: string }>()

const router = useRouter()
const { getPetById, updatePet, deletePet, isLoading } = usePetStore()

const name = ref('')

onMounted(async () => {
  const pet = await getPetById(props.id)
  if (pet) {
    name.value = pet.name
  }
})

async function save() {
  await updatePet(props.id, { name: name.value })
  router.back()
}

async function del() {
  await deletePet(props.id)
  router.back()
}
</script>

<template>
  <label for="pet-name" class="label mb-4">Name:</label>
  <div class="control mb-4" :class="{ 'is-loading': isLoading }">
    <input type="text" class="input" name="pet-name" v-model="name" :disabled="isLoading" />
  </div>
  <!-- TODO: Add picture upload -->
  <button class="button is-success is-pulled-right" @click="save">Speichern</button>
  <button class="button is-danger is-pulled-right mr-2" @click="del">Löschen</button>
  <button class="button is-pulled-right mr-2" @click="router.back()">Abbrechen</button>
</template>
