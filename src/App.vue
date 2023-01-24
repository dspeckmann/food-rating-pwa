<script setup lang="ts">
import { computed, inject, onMounted, Ref, ref } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { Axios } from 'axios';
import { RouterView, useRoute, useRouter } from 'vue-router';

const { loginWithRedirect, getAccessTokenSilently, user, isAuthenticated, logout } = useAuth0()


const router = useRouter()
const route = useRoute()
const currentPageTitle = computed(() => route.meta?.title ?? 'Food Rating' )
const isLoading = ref(true)
const navExpanded = ref(false)

router.beforeResolve(to => {
  navExpanded.value = false
  return true
})

const axios = inject<Axios>('axios')
if (!axios) {
  throw new Error('Error while loading axios.')
}

onMounted(async () => {
  try {
    // TODO: Handle redirect before calling this to fix iOS?
    await new Promise(resolve => window.setTimeout( resolve, 1000))
    const accessToken = await getAccessTokenSilently()
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
    axios.defaults.headers.common['Content-Type'] = 'application/json'
    isLoading.value = false
  } catch (e: any) {
    if (e.error === 'login_required') {
      await loginWithRedirect()
    } else {
      console.error(e)
    }
  }
})

const toggleNav = () => navExpanded.value = !navExpanded.value
</script>

<template>
  <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <div class="navbar-item page-title">🐈 {{ currentPageTitle }}</div>
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" @click="toggleNav()">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" :class="{ 'is-active': navExpanded }">
      <div class="navbar-start">
        <router-link class="navbar-item" to="/">Home</router-link>
        <router-link class="navbar-item" to="/calendar">Kalender</router-link>
        <router-link class="navbar-item" to="/pets">Haustiere</router-link>
        <router-link class="navbar-item" to="/settings">Einstellungen</router-link>
      </div>
    </div>
  </nav>
  <div class="p-4 body-wrapper">
    <div v-if="isLoading" class="progress-bar-wrapper">
      <span class="is-center">Anmelden...</span>
      <progress class="progress is-primary mt-4" max="100"></progress>
    </div>
    <RouterView v-else />
  </div>
</template>

<style scoped>
.page-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #353535;
}

nav.navbar {
  background-color: #f2f2f2;
}

/* TODO: Animate navigation? */
</style>
