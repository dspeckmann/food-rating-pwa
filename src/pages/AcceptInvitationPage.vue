<script setup lang="ts">
import { inject, onMounted, Ref, ref } from 'vue'
import Pet from '../domain/pet'
import InvitationService from '../services/invitation-service'
import PetCard from '../components/PetCard.vue'

const props = defineProps<{ id: string }>()
// TODO: Add injection keys
const invitationService = inject<InvitationService>('InvitationService')

const pet: Ref<Pet | undefined> = ref(undefined)
const showError = ref(false)

onMounted(async () => {
  pet.value = {
    id: 'abc123',
    name: 'Thorsten',
    picture: {
      id: '123',
      presignedDownloadUrl: 'https://www.hellabrunn.de/fileadmin/_processed_/d/8/csm_wasserschwein-tierpark-hellabrunn-amerika-tierlexikon_aa0360216f.jpg'
    },
    createdAt: '',
    updatedAt: ''
  }
  // try {
  //   pet.value = await invitationService!.acceptInvitation(props.id)
  // } catch(e_) {
  //   showError.value = true
  // }
})
</script>

<template>
  <template v-if="pet">
    <h1 class="title">Glückwunsch!</h1>
    <h2 class="title is-4">Du bist nun ein Mitbesitzer von {{ pet.name }}.</h2>
    <PetCard :pet="pet" />
    <router-link class="button is-primary is-fullwidth" to="/">Zurück zur Startseite</router-link>
  </template>
  <div class="notification is-danger" v-else-if="showError">
  </div>
  <div v-else>
    <!-- TODO: Show loading indicator/animation -->
    Einladung wird akzeptiert...
  </div>
</template>
