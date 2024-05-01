import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { store } from './store'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
    components,
    directives,
    display: {
        mobileBreakpoint: 'sm',
    },
})

createApp(App).use(router).use(store).use(vuetify).mount('#app')
