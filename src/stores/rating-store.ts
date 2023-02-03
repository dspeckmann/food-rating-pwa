import { Axios } from "axios";
import { inject, Ref, ref } from "vue";
import CreateRating from "../domain/create-rating";
import Rating from "../domain/rating";

const ratings: Ref<Rating[]> = ref([])
const isLoading = ref(false)

export function useRatingStore() {
  const axios = inject<Axios>('axios')
  if (!axios) {
    throw new Error('Error while loading axios.')
  }

  const loadRatings = async () => {
    isLoading.value = true
    const response = await axios.get('/api/ratings/')
    isLoading.value = false
    ratings.value = response.data
  }

  const addRating = async (rating: CreateRating) => {
    isLoading.value = true
    const response = await axios.post('/api/ratings/', rating)
    const newRating: Rating = response.data
    ratings.value.push(newRating)
    isLoading.value = false
    return newRating
  }

  const deleteRating = async (ratingId: string) => {
    isLoading.value = true
    await axios.delete(`/api/ratings/${ratingId}`)
    const i = ratings.value.findIndex(p => p.id == ratingId)
    ratings.value = ratings.value.splice(i, 1)
    isLoading.value = false
  }

  return {
    ratings,
    loadRatings,
    addRating,
    deleteRating,
    isLoading
  }
}