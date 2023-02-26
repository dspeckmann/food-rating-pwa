<script setup lang="ts">
import { computed } from 'vue';
import Rating from '../domain/rating'
import Taste from '../domain/taste'
import Wellbeing from '../domain/wellbeing'
import { getPrettyDate, getPrettyTime } from '../utils';

const props = defineProps<{ rating: Rating }>()

const pictureUrls = computed(() => {
  return [
    props.rating.picture?.presignedDownloadUrl,
    props.rating.food.picture?.presignedDownloadUrl,
    props.rating.pet.picture?.presignedDownloadUrl
  ].filter(url => url !== undefined)
})

function getEmoji(score: Taste | Wellbeing) {
  switch (score as number) {
    case 1: return '😻'
    case 2: return '😺'
    case 3: return '😾'
  }
}
</script>

<template>
  <div class="card">
    <div class="picture-container">
      <div class="rating-card-picture" v-for="url in pictureUrls" :style="{ 'background-image': `url(${url})` }"></div>
    </div>
    <div class="card-content pt-2">
      <h2 class="title is-4">{{ rating.food.name }}</h2>
      <h3 class="subtitle mb-2">{{ rating.pet.name }}</h3>
      <div class="content rating-card-content">
        <div class="icon-container">
          <div class="taste-container" v-if="rating.taste != undefined">
            Geschmack: 
            <span>{{ getEmoji(rating.taste) }}</span>
          </div>
          <div class="taste-container" v-if="rating.wellbeing != undefined">
            Verträglichkeit:
            <span>{{ getEmoji(rating.wellbeing) }}</span>
          </div>
        </div>
        <div class="date-container">
          {{ getPrettyDate(props.rating.createdAt) }}<br />
          {{ getPrettyTime(props.rating.createdAt) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.picture-container {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  padding: 0.8rem;
  gap: 0.8rem;
}

.rating-card-picture {
  flex: 1;
  /* At max we have 3 pictures with 2 0.8rem gaps in between */
  max-width: calc(33% - 1.6rem);
  /* How cool is aspect-ratio?! */
  aspect-ratio: 1 / 1;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0px 0px 3px 3px rgba(0, 0, 0, 0.1);
}

.rating-card-content {
  display: flex;
  flex-direction: row;
}

.date-container {
  margin-left: auto;
  text-align: right;
  font-style: italic;
}
</style>
