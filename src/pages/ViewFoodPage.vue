<script setup lang="ts">
import { computed, inject, onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import Invitation from '../domain/invitation';
import Pet from '../domain/pet';
import InvitationService from '../services/invitation-service';
import { usePetStore } from '../stores/pet-store'

const props = defineProps<{ id: string }>()

const router = useRouter()
const { getPetById, updatePet, deletePet, isLoading } = usePetStore()
const invitationService = inject<InvitationService>('InvitationService')

const pet: Ref<Pet | undefined> = ref(undefined)
const invitation: Ref<Invitation | undefined> = ref(undefined)

onMounted(async () => {
  pet.value = await getPetById(props.id)
})

async function createInvitation() {
  invitation.value = await invitationService!.createInvitation(props.id)
}

const invitationLink = computed(() => {
  return invitation.value
    ? new URL(router.resolve({ name: 'AcceptInvitation', params: { id: invitation.value.id }}).href, window.location.origin).toString()
    : ''
})

const invitationExpirationDate = computed(() => {
  return invitation.value
    ? new Date(invitation.value.expiresAt).toLocaleDateString() // TODO: Format this in a better way
    : ''
})

const shareSupported = navigator.share !== undefined

const shareButtonIconClass = {
  'fa-share-nodes': shareSupported,
  'fa-copy': !shareSupported
}

// TODO: Remove this page and add functionality to pet list instead.

async function shareInvitationLink() {
  if (shareSupported) {
    await navigator.share({
      title: `${pet.value!.name} ist wählerisch? Tracke jetzt sein Lieblingsfutter mit der Food Rating App.`,
      url: invitationLink.value
    })
    navigator.clipboard.writeText(invitationLink.value)
  } else {
    await navigator.clipboard.writeText(invitationLink.value)
    // TODO: Show notification
  }
}
</script>

<template>
  <template v-if="pet">
    <h1 class="title">{{ pet.name }}</h1>
    <div class="card mb-4" v-if="pet.picture?.presignedDownloadUrl">
      <div class="card-image">
        <figure class="image is-square">
          <img :src="pet.picture.presignedDownloadUrl" />
        </figure>
      </div>
    </div>
    <button class="button is-fullwidth is-primary mb-4" @click="createInvitation" v-if="!invitation">Besitzer hinzufügen</button>
    <div class="notification" v-else>
      <p>Um einen Besitzer hinzuzufügen, schicke ihm einfach den folgenden Link:</p>
      <!-- TODO: Add copy/share button -->
      <div class="field has-addons my-2">
        <div class="control is-expanded">
          <input class="input is-fullwidth" :value="invitationLink" />
        </div>
        <div class="control">
          <button class="button" @click="shareInvitationLink">
            <i class="fa-solid" :class="shareButtonIconClass"></i>
          </button>
        </div>
      </div>
      <p>Er ist gültig bis zum {{ invitationExpirationDate }}.</p>
    </div>
    <router-link class="button is-fullwidth mb-4" :to="{ name: 'EditPet', params: { id: pet.id }}">Bearbeiten</router-link>
    <button class="button is-pulled-right mr-2" @click="router.back()">Zurück</button>
  </template>
  <template v-else>
    <!-- TODO: Move this to component. Do we still need the wrapper? Can we vertically center this? -->
    <div v-if="isLoading" class="progress-bar-wrapper">
      <progress class="progress is-primary mt-4" max="100"></progress>
    </div>
  </template>
</template>
