<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import { inject, reactive, watch } from 'vue';
import SettingsService from '../services/settings/settings-service';

const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0()

const settingsService = inject<SettingsService>('SettingsService')
if (!settingsService) {
  throw new Error('Error while loading settings service.')
}
const settings = reactive(settingsService.getSettings())

watch(settings, newSettings => {
  settingsService.updateSettings(newSettings)
})
</script>

<template>
  <h2 class="title is-2">Benutzerkonto</h2>
  <div v-if="isAuthenticated && user">
    <p>Du bist angemeldet als <strong>{{ user.email }}</strong>.</p>
    <a @click="logout()" class="button mt-4">Logout</a>
  </div>
  <div v-else>
    <p>Du bist zurzeit nicht angemeldet.</p>
    <a @click="loginWithRedirect()" class="button mt-4">Login</a>
  </div>
  <h2 class="title is-2 mt-4">Einstellungen</h2>
  <h3 class="title is-3">Eingabefelder</h3>
  <p class="mb-4">Hier kannst du einstellen, welche Eingabefelder beim Erstellen einer neuen Bewertung angezeigt werden sollen. Selbstverständlich kannst du alle Daten auch später noch nachtragen, wenn du möchtest.</p>
  <div class="field">
    <label class="checkbox">
      <input type="checkbox" v-model="settings.ratingSettings.showTaste">
      Geschmack
    </label>
  </div>
  <div class="field">

    <label class="checkbox">
      <input type="checkbox" v-model="settings.ratingSettings.showWellbeing">
      Verträglichkeit
    </label>
  </div>
  <div class="field">
    <label class="checkbox">
      <input type="checkbox" v-model="settings.ratingSettings.showComment">
      Kommentar
    </label>
  </div>
  <div class="field">
    <label class="checkbox">
      <input type="checkbox" v-model="settings.ratingSettings.showPicture">
      Foto
    </label>
  </div>
  <div class="field">
    <label class="checkbox">
      <input type="checkbox" v-model="settings.ratingSettings.showFoodComment">
      Kommentar zum Futter
    </label>
  </div>
  <div class="field">
    <label class="checkbox">
      <input type="checkbox" v-model="settings.ratingSettings.showFoodPicture">
      Foto vom Futter
    </label>
  </div>
</template>