<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import FoodCard from '../components/FoodCard.vue'
import { useFoodStore } from '../stores/food-store';

const { foods, loadFoods, isLoading: foodStoreLoading } = useFoodStore()
const searchTerm = ref('')
const onlyWellRated = ref(false)

onMounted(async () => {
  await loadFoods()
})

const filteredFoods = computed(() => {
  let result = foods.value

  if (onlyWellRated) {
    // TODO: Does not work right now
    result = result.filter(food => food.isRatedWell)
  }

  if (searchTerm.value != '') {
    // TODO: Use toLocaleLowerCase instead?
    const lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase()
    result = result.filter(food => food.name.toLowerCase().indexOf(lowerCaseSearchTerm) != -1)
  }

  // TODO: Add new DTO so we it cannot be null
  return result.sort((a, b) => new Date(b.lastRatingDate!).getTime() - new Date(a.lastRatingDate!).getTime())
})

const isLoading = computed(() => foodStoreLoading.value && foods.value.length == 0)

function clearSearchTerm() {
  searchTerm.value = ''
}
</script>

<template>
  <div class="field">
    <p class="control has-icons-right">
      <input class="input is-fullwidth" type="text" placeholder="Suchbegriff..." v-model="searchTerm">
      <!-- For some reason, the icon is only clickable when the style is applied in-line instead of using a class. -->
      <span class="icon is-small is-right" v-if="searchTerm" @click="clearSearchTerm()" style="pointer-events: all; cursor: pointer;">
        <i class="fas fa-circle-xmark"></i>
      </span>
    </p>
  </div>
  <div class="field">
    <div class="control">
      <label class="checkbox">
        <input type="checkbox" v-model="onlyWellRated" />
        Nur gut bewertetes Futter anzeigen
      </label>
    </div>
  </div>
  <div v-if="isLoading" class="progress-bar-wrapper">
    <progress class="progress is-primary mt-4" max="100"></progress>
  </div>
  <template v-else>
    <!-- TODO: Add ViewFood page and link to it -->
    <FoodCard v-for="food of filteredFoods" :food="food" />
    <!-- <router-link v-for="food of filteredFoods" :to="{ name: 'ViewFood', params: { id: food.id }}">
      <FoodCard :food="food" />
    </router-link> -->
  </template>
</template>

<style scoped>
</style>