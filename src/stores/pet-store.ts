import { Axios } from "axios";
import { inject, Ref, ref } from "vue";
import CreatePet from "../domain/create-pet";
import Pet from "../domain/pet";

const pets: Ref<Pet[]> = ref([])
const isLoading = ref(false)

export function usePetStore() {
  const axios = inject<Axios>('axios')
  if (!axios) {
    throw new Error('Error while loading axios.')
  }

  const loadPets = async () => {
    isLoading.value = true
    const response = await axios.get('/api/pets/')
    isLoading.value = false
    pets.value = response.data
  }

  const addPet = async (pet: CreatePet) => {
    isLoading.value = true
    const response = await axios.post('/api/pets/', pet)
    const newPet: Pet = response.data
    pets.value.push(newPet)
    isLoading.value = false
    return newPet
  }

  const updatePet = async (id: string, pet: CreatePet) => {
    isLoading.value = true
    const response = await axios.put(`/api/pets/${id}`, pet)
    const updatedPet: Pet = response.data
    const i = pets.value.findIndex(p => p.id == updatedPet.id)
    if (i != -1) {
      pets.value[i] = updatedPet
    } else {
      pets.value.push(updatedPet)
    }
    isLoading.value = false
    return updatedPet
  }

  const deletePet = async (petId: string) => {
    isLoading.value = true
    const response = await axios.delete(`/api/pets/${petId}`)
    const i = pets.value.findIndex(p => p.id == petId)
    if (i != -1) {
      pets.value = pets.value.splice(i, 1)
    }
    isLoading.value = false
  }

  const getPetById = async (petId: string): Promise<Pet | undefined> => {
    isLoading.value = true
    if (pets.value.length) {
      isLoading.value = false
      return pets.value.find(p => p.id == petId)
    } else {
      const response = await axios.get(`/api/pets/${petId}`)
      isLoading.value = false
      return response.data
    }
  }

  return {
    pets,
    loadPets,
    addPet,
    updatePet,
    deletePet,
    getPetById,
    isLoading
  }
}