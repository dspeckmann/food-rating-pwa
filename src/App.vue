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
  <div class="splashscreen" v-if="isLoading">
    <progress class="progress is-primary mt-4" max="100"></progress>
  </div>
  <template v-else>
    <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <div class="navbar-item page-title"><router-link class="mr-2" :to="{ name: 'Calendar' }">🐈</router-link> {{ currentPageTitle }}</div>
        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" @click="toggleNav()">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-menu" :class="{ 'is-active': navExpanded }">
        <div class="navbar-start">
          <router-link class="navbar-item has-text-weight-bold" :to="{ name: 'AddRating' }">Futter bewerten</router-link>
          <router-link class="navbar-item" :to="{ name: 'Calendar' }">Kalender</router-link>
          <router-link class="navbar-item" :to="{ name: 'ListPets' }">Haustiere</router-link>
          <router-link class="navbar-item" :to="{ name: 'ListFoods' }">Futter</router-link>
          <!-- TODO: Why does route name not work? -->
          <router-link class="navbar-item" to="/settings">Einstellungen</router-link>
        </div>
      </div>
    </nav>
    <div class="p-4 body-wrapper">
      <RouterView />
    </div>
  </template>
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

.splashscreen {
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  padding: 20px;
}

.splashscreen::before {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-image: url('./assets/paw_pattern.png');
  filter: invert(97%) sepia(32%) saturate(234%) hue-rotate(33deg) brightness(108%) contrast(93%);
}

.splashscreen progress {
  z-index: 5;
  box-shadow: 0 0 30px 15px white;
}

/* TODO: Animate navigation? */
</style>
