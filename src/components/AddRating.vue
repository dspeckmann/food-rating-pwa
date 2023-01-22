<script setup lang="ts">
import { ref } from 'vue'
import Camera from 'simple-vue-camera'
import RatedFood from '../domain/rated-food';
import Rating from '../domain/rating';
import Pet from '../domain/pet';
import CreateFoodRating from '../domain/create-food-rating';
import FoodRating from '../domain/food-rating';
import { blobToBase64 } from '../utils';
import { useAuth0 } from '@auth0/auth0-vue';

const props = defineProps<{ pet: Pet }>()
const emit = defineEmits(['ratingAdded', 'cancelled'])

const { getAccessTokenSilently } = useAuth0()

const pictureTaken = ref(false)
const camera = ref<InstanceType<typeof Camera>>()
let picture: any = null

async function takePicture() {
  picture = await camera.value?.snapshot()
  camera.value?.pause()
  pictureTaken.value = true
}

function cancel() {
  emit('cancelled')
}

async function rate(rating: number) {
  if (picture) {
    const accessToken = await getAccessTokenSilently()
    const dto: CreateFoodRating = {
      pictureDataString: await blobToBase64(picture),
      rating: rating
    }
    const response = await fetch(`/api/pets/${props.pet.id}/ratings`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dto)
    })
    const foodRating: FoodRating = await response.json()
    emit('ratingAdded', foodRating)
  } else {
    restart()
  }
}

async function restart() {
  camera.value?.resume()
  pictureTaken.value = false
}
</script>

<template>
  <Camera autoplay :resolution="{ width: 1080, height: 1080 }" ref="camera">
    <div class="button-overlay" v-if="pictureTaken">
      <div class="thumbs-container">
        <button class="button is-large" @click="rate(Rating.Bad)">😾</button>
        <button class="button is-large" @click="rate(Rating.Medium)">🐱</button>
        <button class="button is-large" @click="rate(Rating.Good)">😻</button>
      </div>
      <button class="button" @click="restart" id="restart-button"><i class="fa-solid fa-arrows-rotate mr-2"></i> Neues Foto</button>
    </div>
  </Camera>
  <div class="camera-button-container">
    <button class="button is-large" @click="takePicture" v-if="!pictureTaken"><i class="fa-solid fa-camera"></i></button>
    <button class="button is-large" @click="cancel" v-if="!pictureTaken"><i class="fa-solid fa-xmark"></i></button>
  </div>
</template>

<style scoped>
.button-overlay {
  width: 100%;
  height: 100%;
  background: rgba(100, 100, 100, 0.6);
  display: flex;
  flex-direction: column;
}

.thumbs-container {
  display: flex;
  flex-direction: row;
  margin: auto;
  gap: 32px;
}

.emoji-button {
  /* font-size: 3rem;
  padding: 0.5rem; */
}

#restart-button {
  margin: 0 32px 32px 32px;
}

.camera-button-container {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 32px;
}
</style>
