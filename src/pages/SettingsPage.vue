<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';

const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0()
</script>

<template>
    <div v-if="isAuthenticated && user">
        <p>Du bist angemeldet als <strong>{{ user.email }}</strong>.</p>
        <a @click="logout()" class="button mt-4">Logout</a>
    </div>
    <div v-else>
        <p>Du bist zurzeit nicht angemeldet.</p>
        <a @click="loginWithRedirect()" class="button mt-4">Login</a>
    </div>
</template>
