<script setup lang="ts">
import { Axios } from 'axios';
import { inject, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import PictureUploadControl from '../components/controls/PictureUploadControl.vue';
import { usePetStore } from '../stores/pet-store';

const router = useRouter()

const { addPet, isLoading } = usePetStore()
const petName = ref('')
const pictureId: Ref<string | undefined> = ref(undefined)

async function save() {
  await addPet({ name: petName.value, pictureId: pictureId.value })
  router.back()
}
</script>

<template>
  <div class="field">
    <label class="label" for="pet-name">Wie heißt dein Haustier?</label>
    <div class="control my-4" :class="{ 'is-loading': isLoading }">
      <input type="text" class="input is-fullwidth" name="pet-name" v-model="petName" :disabled="isLoading" />
    </div>
  </div>
  <div class="field">
    <label class="label" for="pet-picture">Wie sieht dein Haustier aus?</label>
    <PictureUploadControl v-model="pictureId" />
  </div>
  <button class="button is-success is-pulled-right" @click="save">Fertig</button>
  <button class="button is-pulled-right mr-2" @click="router.back()">Abbrechen</button>
</template>
