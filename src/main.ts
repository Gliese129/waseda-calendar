import { createApp, provide } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { store, key } from './store'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { VNumberInput, VTimePicker } from 'vuetify/labs/components'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import '@mdi/font/css/materialdesignicons.css'
import 'virtual:uno.css'

const vuetify = createVuetify({
    components: {
        VNumberInput,
        VTimePicker,
        ...components,
    },
    directives,
    display: {
        mobileBreakpoint: 'sm',
    },
})

const app = createApp(App)

app.use(router).use(store, key).use(vuetify)

app.config.errorHandler = (err, vm, info) => {
    console.error(err, vm, info)
    provide('error', err)
}

app.mount('#app')
