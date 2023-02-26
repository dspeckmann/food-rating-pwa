import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createAuth0 } from '@auth0/auth0-vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import VCalendar from 'v-calendar';
import InvitationService from './services/invitation-service'
import SettingsService from './services/settings/settings-service'

// Load config file for environment-specific settings.
const response = await fetch('/config.json')
const config = await response.json()

const app = createApp(App)

app.use(
    createAuth0({
        domain: config.auth0.domain,
        clientId: config.auth0.clientId,
        authorizationParams: {
            redirect_uri: window.location.origin,
            audience: config.auth0.audience,
            
        },
        cacheLocation: 'localstorage'
    })
)

app.use(createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'is-active'
}))

app.use(VCalendar, {})

axios.defaults.baseURL = config.apiBaseUrl
app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)
app.provide('InvitationService', new InvitationService(axios))

const settingsService = new SettingsService()
settingsService.loadSettings()
app.provide('SettingsService', settingsService)

app.mount('#app')
