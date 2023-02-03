<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import PictureUploadControl from '../components/controls/PictureUploadControl.vue';
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
const router = useRouter()

const state = reactive({
  selectedFood: NEW_FOOD_VALUE,
  newFoodName: '',
  newFoodPictureId: undefined,
  newFoodComment: '',
  ratingComment: '',
  taste: -1, // TODO: Type?
  wellbeing: -1, // TODO: Type?
  ratingPictureId: undefined
})

onMounted(async () => {
  await loadFoods()
})

async function save() {
  if (state.selectedFood === NEW_FOOD_VALUE) {
    const newFood: CreateFood = {
      name: state.newFoodName,
      comment: state.newFoodComment,
      pictureId: state.newFoodPictureId
    }
    const createdFood = await addFood(newFood)
    state.selectedFood = createdFood.id
  }

  const newRating: CreateRating = {
    petId: props.petId,
    foodId: state.selectedFood,
    comment: state.ratingComment,
    taste: state.taste, // TODO: Only if valid value?
    wellbeing: state.wellbeing, // TODO: Only if valid value?
    pictureId: state.ratingPictureId
  }

  await addRating(newRating)
  router.back()
}
</script>

<template>
  <div class="field">
    <label class="label">Womit hast du dein Tier heute gefüttert?</label>
    <div class="control">
      <div class="select is-fullwidth">
        <select v-model="state.selectedFood" :disabled="isLoading" :class="{ 'is-loading': isLoading }">
          <option value="new">Neues Futter</option>
          <option v-for="food in foods" :value="food.id">{{ food.name }}</option>
        </select>
      </div>
    </div>
  </div>
  <template v-if="state.selectedFood === NEW_FOOD_VALUE">
    <div class="field">
      <label class="label">Wie heißt das neue Futter?</label>
      <div class="control">
        <input class="input is-fullwidth" type="text" placeholder="Name des neuen Futters" v-model="state.newFoodName">
      </div>
    </div>
    <div class="field">
      <label class="label" for="pet-picture">Wie sieht die Verpackung des neuen Futters aus?</label>
      <PictureUploadControl v-model="state.newFoodPictureId" />
    </div>
    <div class="field">
      <label class="label">Hast du allgemeine Anmerkungen zu diesem Futter?</label>
      <div class="control">
        <textarea class="textarea is-fullwidth" placeholder="Anmerkungen zum Futter" v-model="state.newFoodComment"></textarea>
      </div>
    </div>
  </template>
  <!-- TODO: Picture of new food -->
  <div class="field">
    <label class="label">Wie hat deinem Tier das Futter geschmeckt?</label>
    <div class="control radio-container">
      <label class="radio">
        <input type="radio" name="rating-taste" v-model="state.taste" :value="Taste.Good">
        😻 Lecker!
      </label>
      <label class="radio">
        <input type="radio" name="rating-taste" v-model="state.taste" :value="Taste.Medium">
        🐱 Ganz okay.
      </label>
      <label class="radio">
        <input type="radio" name="rating-taste" v-model="state.taste" :value="Taste.Bad">
        😾 Ekelhaft...
      </label>
    </div>
  </div>
  <div class="field">
    <label class="label">Wie hat dein Tier das Futter vertragen?</label>
    <div class="control radio-container">
      <label class="radio">
        <input type="radio" name="rating-wellbeing" v-model="state.wellbeing" :value="Wellbeing.Good">
        😻 Gut
      </label>
      <label class="radio">
        <input type="radio" name="rating-wellbeing" v-model="state.wellbeing" :value="Wellbeing.Medium">
        🐱 Okay
      </label>
      <label class="radio">
        <input type="radio" name="rating-wellbeing" v-model="state.wellbeing" :value="Wellbeing.Bad">
        😾 Schlecht
      </label>
    </div>
  </div>
  <div class="field">
    <label class="label" for="pet-picture">Wie sah das Futter in der Schale aus?</label>
    <PictureUploadControl v-model="state.ratingPictureId" />
  </div>
  <div class="field">
    <label class="label">Hast du weitere Anmerkungen zu dieser Fütterung?</label>
    <div class="control">
      <textarea class="textarea is-fullwidth" placeholder="Sonstige Anmerkungen zur Fütterung" v-model="state.ratingComment"></textarea>
    </div>
  </div>
  <button class="button is-primary is-fullwidth" @click="save()">Speichern</button>
</template>

<style scoped>
.radio-container {
  display: flex;
  justify-content: space-between;
}
</style>