<script setup lang="ts">
import 'v-calendar/dist/style.css';
import { ref } from 'vue';


const selectedDate = ref(new Date())
const calendarAttributes = ref([
  {
    dates: [
      new Date('2023-01-22'),
      new Date('2023-01-18')
    ],
    key: 1, // Can be ID
    // Attribute type definitions
    // highlight: true,  // Boolean, String, Object
    dot: {
      color: 'red'
    },
    // bar: true,        // Boolean, String, Object
    // content: 'red',   // Boolean, String, Object
    // popover: { ... }, // Only objects allowed
    // // Your custom data object for later access, if needed
    // customData: { ... },
    order: 0 // Z-index
  },
  {
    dates: new Date('2023-01-18'),
    key: 2,
    dot: { color: 'blue' },
    order: 1
  }
])

// TODO: Get all ratings to highlight them (per pet?)

</script>

<template>
  <v-date-picker is-expanded :attributes="calendarAttributes" v-model="selectedDate" />
</template>
