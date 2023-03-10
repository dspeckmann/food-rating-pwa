<script setup lang="ts">
import { computed, inject, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import PictureUploadControl from '../components/controls/PictureUploadControl.vue';
import CreateFood from '../domain/create-food';
import CreateRating from '../domain/create-rating';
import Food from '../domain/food';
import Pet from '../domain/pet';
import Taste from '../domain/taste';
import Wellbeing from '../domain/wellbeing';
import SettingsService from '../services/settings/settings-service';
import { useFoodStore } from '../stores/food-store';
import { usePetStore } from '../stores/pet-store';
import { useRatingStore } from '../stores/rating-store';

const { foods, loadFoods, addFood, isLoading: foodStoreLoading } = useFoodStore()
const { pets, loadPets, isLoading: petStoreLoading } = usePetStore()
const { addRating, isLoading: ratingStoreLoading } = useRatingStore()
const router = useRouter()

const state = reactive({
  selectedPet: pets.value.length === 1 ? pets.value[0] : undefined,
  selectedFood: undefined as Food | undefined,
  newFoodName: '',
  newFoodPictureId: undefined,
  newFoodComment: '',
  ratingComment: '',
  taste: undefined as Taste | undefined,
  wellbeing: undefined as Wellbeing | undefined,
  ratingPictureId: undefined
})

onMounted(async () => {
  await loadPets()
  // TODO: Does not work on iOS.
  if (state.selectedPet === undefined && pets.value.length === 1) {
    state.selectedPet = pets.value[0]
  }
  await loadFoods()
})

// TODO: Move AddPet stuff to it's own component and allow user to create new pets here?
// TODO: Do the same for new foods on a seperate food list page.
// TODO: Food list page can also be used to search for food or show all good ones :)

async function save() {
  if (state.selectedFood === undefined) {
    const newFood: CreateFood = {
      name: state.newFoodName,
      comment: state.newFoodComment,
      pictureId: state.newFoodPictureId
    }
    const createdFood = await addFood(newFood)
    state.selectedFood = createdFood
  }

  const newRating: CreateRating = {
    petId: state.selectedPet!.id,
    foodId: state.selectedFood.id,
    comment: state.ratingComment,
    taste: state.taste, // TODO: Only if valid value?
    wellbeing: state.wellbeing, // TODO: Only if valid value?
    pictureId: state.ratingPictureId
  }

  await addRating(newRating)
  router.back()
}

const isLoadingPets = computed(() => pets.value.length < 1 && petStoreLoading.value)
const isLoadingFoods = computed(() => foods.value.length < 1 && foodStoreLoading.value)

const settingsService = inject<SettingsService>('SettingsService')
if (!settingsService) {
  throw new Error('Error while loading settings service.')
}
const settings = settingsService.getSettings().ratingSettings

// TODO: Actually validate form
const submitDisabled = computed(() => isLoadingPets.value || isLoadingFoods.value || ratingStoreLoading.value || state.selectedPet === undefined)
</script>

<template>
  <div class="field">
    <label class="label">Welches Haustier hast du gef??ttert?</label>
    <div class="control">
      <div class="select is-fullwidth">
        <select v-model="state.selectedPet" :disabled="isLoadingPets" :class="{ 'is-loading': isLoadingPets }">
          <option v-for="pet in pets" :value="pet">{{ pet.name }}</option>
        </select>
      </div>
    </div>
  </div>
  <div class="field">
    <label class="label">Womit hast du {{ state.selectedPet ? state.selectedPet.name : 'dein Haustier' }} gef??ttert?</label>
    <div class="control">
      <div class="select is-fullwidth">
        <select v-model="state.selectedFood" :disabled="isLoadingFoods" :class="{ 'is-loading': isLoadingFoods }">
          <option :value="undefined">Neues Futter</option>
          <option v-for="food in foods" :value="food">{{ food.name }}</option>
        </select>
      </div>
    </div>
  </div>
  <template v-if="state.selectedFood === undefined">
    <div class="field">
      <label class="label">Wie hei??t das neue Futter?</label>
      <div class="control">
        <input class="input is-fullwidth" type="text" placeholder="Name des neuen Futters" v-model="state.newFoodName">
      </div>
    </div>
    <div class="field" v-if="settings.showFoodPicture">
      <label class="label" for="pet-picture">Wie sieht die Verpackung des neuen Futters aus?</label>
      <PictureUploadControl v-model="state.newFoodPictureId" />
    </div>
    <div class="field" v-if="settings.showFoodComment">
      <label class="label">Hast du allgemeine Anmerkungen zu diesem Futter?</label>
      <div class="control">
        <textarea class="textarea is-fullwidth" placeholder="Anmerkungen zum Futter" v-model="state.newFoodComment"></textarea>
      </div>
    </div>
  </template>
  <div class="field" v-if="settings.showTaste">
    <label class="label">Wie hat {{ state.selectedPet ? state.selectedPet.name : 'deinem Haustier' }} das Futter geschmeckt?</label>
    <div class="control radio-container">
      <label class="radio">
        <input type="radio" name="rating-taste" v-model="state.taste" :value="Taste.Good">
        ???? Lecker!
      </label>
      <label class="radio">
        <input type="radio" name="rating-taste" v-model="state.taste" :value="Taste.Medium">
        ???? Ganz okay.
      </label>
      <label class="radio">
        <input type="radio" name="rating-taste" v-model="state.taste" :value="Taste.Bad">
        ???? Ekelhaft...
      </label>
    </div>
  </div>
  <div class="field" v-if="settings.showWellbeing">
    <label class="label">Wie hat {{ state.selectedPet ? state.selectedPet.name : 'dein Haustier' }} das Futter vertragen?</label>
    <div class="control radio-container">
      <label class="radio">
        <input type="radio" name="rating-wellbeing" v-model="state.wellbeing" :value="Wellbeing.Good">
        ???? Gut
      </label>
      <label class="radio">
        <input type="radio" name="rating-wellbeing" v-model="state.wellbeing" :value="Wellbeing.Medium">
        ???? Okay
      </label>
      <label class="radio">
        <input type="radio" name="rating-wellbeing" v-model="state.wellbeing" :value="Wellbeing.Bad">
        ???? Schlecht
      </label>
    </div>
  </div>
  <div class="field" v-if="settings.showPicture">
    <label class="label" for="pet-picture">Wie sah das Futter in der Schale aus?</label>
    <PictureUploadControl v-model="state.ratingPictureId" />
  </div>
  <div class="field"  v-if="settings.showComment">
    <label class="label">Hast du weitere Anmerkungen zu dieser F??tterung?</label>
    <div class="control">
      <textarea class="textarea is-fullwidth" placeholder="Sonstige Anmerkungen zur F??tterung" v-model="state.ratingComment"></textarea>
    </div>
  </div>
  <button class="button is-primary is-fullwidth" :class="{ 'is-disabled': submitDisabled }" @click="save()" :disabled="submitDisabled">Speichern</button>
</template>

<style scoped>
.radio-container {
  display: flex;
  justify-content: space-between;
}
</style>