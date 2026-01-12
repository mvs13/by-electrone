import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { apolloPlugin } from './graphql/apollo-tree'
import VueApolloComponents from '@vue/apollo-components'
import { apolloProvider } from './graphql/apollo-provider'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// Для простых запросов с использованием useQuery
app.use(apolloPlugin)
// Для запросов с использованием ApolloComponents
app.use(VueApolloComponents)
app.use(apolloProvider)

app.mount('#app')
