import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { store, key } from './store'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import '@mdi/font/css/materialdesignicons.css'
import 'virtual:uno.css'

const vuetify = createVuetify({
    components: {
        VNumberInput,
        ...components,
    },
    directives,
    display: {
        mobileBreakpoint: 'sm',
    },
})

const app = createApp(App)

app.use(router).use(store, key).use(vuetify)

app.mount('#app')
