<script setup lang="ts">
import { computed, inject, onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import Invitation from '../domain/invitation';
import InvitationService from '../services/invitation-service';
import { usePetStore } from '../stores/pet-store'

const props = defineProps<{ id: string }>()

const router = useRouter()
const { getPetById, updatePet, deletePet, isLoading } = usePetStore()
const invitationService = inject<InvitationService>('InvitationService')

const name = ref('')
const invitation: Ref<Invitation | undefined> = ref(undefined)

onMounted(async () => {
  const pet = await getPetById(props.id)
  if (pet) {
    name.value = pet.name
  }
})

async function save() {
  await updatePet(props.id, { name: name.value })
  router.back()
}

async function del() {
  await deletePet(props.id)
  router.back()
}

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
</script>

<template>
  <label for="pet-name" class="label mb-4">Name:</label>
  <div class="control mb-4" :class="{ 'is-loading': isLoading }">
    <input type="text" class="input" name="pet-name" v-model="name" :disabled="isLoading" />
  </div>
  <button class="button is-fullwidth mb-4" @click="createInvitation" v-if="!invitation">Besitzer hinzufügen</button>
  <div class="notification" v-else>
    <p>Um einen Besitzer hinzuzufügen, schicke ihm einfach den folgenden Link:</p>
    <!-- TODO: Add copy/share button -->
    <input class="input is-fullwidth my-2" :value="invitationLink" />
    <p>Er ist gültig bis zum {{ invitationExpirationDate }}.</p>
  </div>
  <button class="button is-success is-pulled-right" @click="save">Speichern</button>
  <button class="button is-danger is-pulled-right mr-2" @click="del">Löschen</button>
  <button class="button is-pulled-right mr-2" @click="router.back()">Abbrechen</button>
</template>
