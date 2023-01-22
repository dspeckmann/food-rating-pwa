import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createAuth0 } from '@auth0/auth0-vue'

const app = createApp(App)

app.use(
    createAuth0({
        // TODO: Show informative message if these are undefined?
        domain: import.meta.env.VITE_AUTH0_DOMAIN!,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID!,
        authorizationParams: {
            redirect_uri: window.location.origin,
            audience: import.meta.env.VITE_AUTH0_AUDIENCE!
        }
    })
)

app.mount('#app')
