<script setup lang="ts">
import 'v-calendar/dist/style.css';
import { computed, onMounted, Ref, ref } from 'vue'
import { useRatingStore } from '../stores/rating-store'
import ListRatings from '../components/ListRatings.vue'
import ProgressBar from '../components/controls/ProgressBar.vue'

const { ratings, loadRatings, isLoading } = useRatingStore()

const selectedDate: Ref<Date | undefined> = ref(undefined)

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
  let result = ratings.value

  if (selectedDate.value) {
    result = result.filter(r => new Date(r.createdAt).getDate() == selectedDate.value!.getDate())
  }

  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})
</script>

<template>
  <router-link
    class="button is-primary is-fullwidth mb-4"
    :to="{ name: 'AddRating' }"
    id="add-rating-button">
    Futter bewerten
  </router-link>
  <v-date-picker is-expanded :attributes="calendarAttributes" v-model="selectedDate" class="mb-4" :max-date="new Date()" />
  <ProgressBar v-if="isLoading" class="mt-4" />
  <ListRatings v-else-if="filteredRatings.length" :ratings="filteredRatings" />
  <div class="notification" v-else>
    An diesem Tag hast du keine Fütterung eingetragen.
  </div>
</template>
