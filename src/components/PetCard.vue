<script setup lang="ts">
import Pet from '../domain/pet';

const props = defineProps<{ pet: Pet }>()
</script>

<template>
  <div class="card mb-4">
    <div class="card-image">
      <figure class="image is-square">
        <img :src="pet.picture?.presignedDownloadUrl" />
      </figure>
    </div>
    <div class="card-content">
      <div class="content has-text-centered">
        <h2 class="title is-4 my-0">{{ pet.name }}</h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>