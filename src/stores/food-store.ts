import { Axios } from "axios";
import { inject, Ref, ref } from "vue"
import CreateFood from "../domain/create-food";
import Food from "../domain/food"

const foods: Ref<Food[]> = ref([])
const isLoading = ref(false)

export function useFoodStore() {
  const axios = inject<Axios>('axios')
  if (!axios) {
    throw new Error('Error while loading axios.')
  }

  const loadFoods = async () => {
    isLoading.value = true
    const response = await axios.get('/api/foods/')
    isLoading.value = false
    foods.value = response.data
  }

  const addFood = async (food: CreateFood) => {
    isLoading.value = true
    const response = await axios.post('/api/foods/', food)
    const newFood: Food = response.data
    foods.value.push(newFood)
    isLoading.value = false
    return newFood
  }

  const updateFood = async (foodId: string, food: CreateFood) => {
    isLoading.value = true
    const response = await axios.put(`/api/foods/${foodId}`, food)
    const updatedFood: Food = response.data
    const i = foods.value.findIndex(p => p.id == updatedFood.id)
    if (i != -1) {
      foods.value[i] = updatedFood
    } else {
      foods.value.push(updatedFood)
    }
    isLoading.value = false
    return updatedFood
  }

  const deleteFood = async (foodId: string) => {
    isLoading.value = true
    const response = await axios.delete(`/api/foods/${foodId}`)
    const i = foods.value.findIndex(p => p.id == foodId)
    if (i != -1) {
      foods.value = foods.value.splice(i, 1)
    }
    isLoading.value = false
  }

  const getFoodById = async (foodId: string): Promise<Food | undefined> => {
    isLoading.value = true
    if (foods.value.length) {
      isLoading.value = false
      return foods.value.find(p => p.id == foodId)
    } else {
      const response = await axios.get(`/api/foods/${foodId}`)
      isLoading.value = false
      return response.data
    }
  }

  return {
    foods,
    loadFoods,
    addFood,
    updateFood,
    deleteFood,
    getFoodById,
    isLoading
  }
}