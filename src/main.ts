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
import * as Sentry from '@sentry/vue'

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

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'is-active'
})

if (config.sentry?.dsn) {
    Sentry.init({
        app,
        dsn: config.sentry.dsn,
        integrations: [
          Sentry.browserTracingIntegration({ router }),
          Sentry.replayIntegration(),
        ],
        tracesSampleRate: config.sentry.tracesSampleRate ?? 0,
        tracePropagationTargets: [config.apiBaseUrl ?? "localhost"],
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
    })
}

app.use(router)

app.use(VCalendar, {})

axios.defaults.baseURL = config.apiBaseUrl
app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)
app.provide('InvitationService', new InvitationService(axios))

const settingsService = new SettingsService()
settingsService.loadSettings()
app.provide('SettingsService', settingsService)

app.mount('#app')
