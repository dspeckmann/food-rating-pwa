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
    // TODO: Filter by ratings
    // Calculate in SQL query, don't return all ratings for every food
  }
  if (searchTerm.value != '') {
    // TODO: Use toLocaleLowerCase instead?
    result = result.filter(food => food.name.toLowerCase().indexOf(searchTerm.value.toLowerCase()))
  }
  // TODO: Order by most recent rating instead
  // Calculate in SQL query, don't return all ratings for every food
  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

const isLoading = computed(() => foodStoreLoading.value && foods.value.length == 0)
</script>

<template>
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
