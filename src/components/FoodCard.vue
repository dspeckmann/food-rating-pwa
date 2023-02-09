<script setup lang="ts">
import Food from '../domain/food';

const props = defineProps<{ food: Food }>()
</script>

<template>
  <div class="card mb-4">
    <div class="card-image" v-if="food.picture?.presignedDownloadUrl">
      <figure class="image is-square">
        <img :src="food.picture.presignedDownloadUrl" />
      </figure>
    </div>
    <div class="card-content">
      <div class="content has-text-centered">
        <h2 class="title is-4 my-0">{{ food.name }}</h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>