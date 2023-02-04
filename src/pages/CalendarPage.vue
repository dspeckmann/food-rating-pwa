<script setup lang="ts">
import 'v-calendar/dist/style.css';
import { computed, onMounted, ref } from 'vue'
import { useRatingStore } from '../stores/rating-store'
import RatingCard from '../components/RatingCard.vue'

const { ratings, loadRatings } = useRatingStore()

const selectedDate = ref(new Date())

onMounted(async () => {
  await loadRatings()
})

const calendarAttributes = computed(() => {
  // TODO: Add different colors per pet?
  return [
    {
      dates: ratings.value.map(r => new Date(r.createdAt)),
      key: 1, // Can be ID // TODO: Pet ID? Or one entry for each rating?
      // highlight: true, // Boolean, String, Object
      highlight: {
        color: 'blue',
        fillMode: 'light',
      },
      // dot: {
      //   color: 'red'
      // },
      // bar: true,        // Boolean, String, Object
      // content: 'red',   // Boolean, String, Object
      // popover: { ... }, // Only objects allowed
      // // Your custom data object for later access, if needed
      // customData: { ... },
      order: 0 // Z-index
    }
  ]
})

const filteredRatings = computed(() => {
  return ratings.value
    .filter(r => new Date(r.createdAt).getDate() == selectedDate.value.getDate())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})
</script>

<template>
  <v-date-picker is-expanded :attributes="calendarAttributes" v-model="selectedDate" class="mb-4" :max-date="new Date()" />
  <template v-if="filteredRatings.length">
    <RatingCard :rating="rating" v-for="rating in filteredRatings" />
  </template>
  <div class="notification" v-else>
    An diesem Tag hast du keine Fütterung eingetragen.
  </div>
</template>
