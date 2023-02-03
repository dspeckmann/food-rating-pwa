<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import CreateFood from '../domain/create-food';
import CreateRating from '../domain/create-rating';
import Taste from '../domain/taste';
import Wellbeing from '../domain/wellbeing';
import { useFoodStore } from '../stores/food-store';
import { useRatingStore } from '../stores/rating-store';

const NEW_FOOD_VALUE = 'new'

const props = defineProps<{ petId: string }>()

const { foods, loadFoods, addFood, isLoading } = useFoodStore()
const { addRating } = useRatingStore()

const state = reactive({
  selectedFood: NEW_FOOD_VALUE,
  newFoodName: '',
  foodComment: '',  // TODO: Update when new food is selected?
  ratingComment: '',
  taste: -1, // TODO: Type?
  wellbeing: -1 // TODO: Type?
})

onMounted(async () => {
  await loadFoods()
})

async function save() {
  if (state.selectedFood === NEW_FOOD_VALUE) {
    const newFood: CreateFood = {
      name: state.newFoodName,
      comment: state.foodComment
      // TODO: Picture
    }
    const createdFood = await addFood(newFood)
    state.selectedFood = createdFood.id
  }

  const newRating: CreateRating = {
    petId: props.petId,
    foodId: state.selectedFood,
    comment: state.ratingComment,
    taste: state.taste, // TODO: Only if valid value?
    wellbeing: state.wellbeing // TODO: Only if valid value?
  }

  // TODO: Call ratingStore.addRating
  // TODO: Implement it first :)
  console.log('SAVE!', state)
}
</script>

<template>
  <div class="field">
    <label class="Label">Womit hast du dein Tier heute gefüttert?</label>
    <div class="control">
      <div class="select is-fullwidth">
        <select v-model="state.selectedFood" :disabled="isLoading" :class="{ 'is-loading': isLoading }">
          <option value="new">Neues Futter</option>
          <option v-for="food in foods" :value="food.id">{{ food.name }}</option>
        </select>
      </div>
    </div>
  </div>
  <div class="field" v-if="state.selectedFood === NEW_FOOD_VALUE">
    <label class="Label">Wie heißt das neue Futter?</label>
    <div class="control">
      <input class="input is-fullwidth" type="text" placeholder="Name des neuen Futters" v-model="state.newFoodName">
    </div>
  </div>
  <div class="field">
    <label class="Label">Hast du allgemeine Anmerkungen zu diesem Futter?</label>
    <div class="control">
      <textarea class="textarea is-fullwidth" placeholder="Anmerkungen zum Futter" v-model="state.foodComment"></textarea>
    </div>
  </div>
  <!-- TODO: Picture of new food -->
  <div class="field">
    <label class="Label">Wie hat deinem Tier das Futter geschmeckt?</label>
    <div class="control">
      <label class="radio">
        <input type="radio" name="question" v-model="state.taste" :value="Taste.Good">
        Lecker!
      </label>
      <label class="radio">
        <input type="radio" name="question" v-model="state.taste" :value="Taste.Medium">
        Ganz okay.
      </label>
      <label class="radio">
        <input type="radio" name="question" v-model="state.taste" :value="Taste.Bad">
        Ekelhaft...
      </label>
    </div>
  </div>
  <div class="field">
    <label class="label">Wie hat dein Tier das Futter vertragen?</label>
    <div class="control">
      <label class="radio">
        <input type="radio" name="question" v-model="state.taste" :value="Wellbeing.Good">
        Gut
      </label>
      <label class="radio">
        <input type="radio" name="question" v-model="state.taste" :value="Wellbeing.Medium">
        Okay
      </label>
      <label class="radio">
        <input type="radio" name="question" v-model="state.taste" :value="Wellbeing.Bad">
        Schlecht
      </label>
    </div>
  </div>
  <div class="field">
    <div class="control">
      <label class="radio">
        <input type="radio" name="question">
        Yes
      </label>
    </div>
  </div>
  <div class="field">
    <label class="Label">Hast du weitere Anmerkungen zu dieser Fütterung?</label>
    <div class="control">
      <textarea class="textarea is-fullwidth" placeholder="Sonstige Anmerkungen zur Fütterung" v-model="state.ratingComment"></textarea>
    </div>
  </div>
  <!-- TODO: Picture of rating -->
  <button class="button is-primary is-fullwidth" @click="save()">Speichern</button>
</template>
