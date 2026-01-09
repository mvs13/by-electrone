import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { apolloPlugin } from './graphql/apollo-tree'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(apolloPlugin)

app.mount('#app')
