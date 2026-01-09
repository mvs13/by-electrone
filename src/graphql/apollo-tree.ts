const APIURI = 'https://swapi-graphql.netlify.app/graphql'
const AppID = 'swapi'
// Based on alexop.dev/posts/getting-started-graphql-vue3-apollo-typescript/
import { DefaultApolloClient } from '@vue/apollo-composable'
import type { App } from 'vue'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core'

const httpLink = new HttpLink({
  uri: APIURI,
  headers: {
    'app-id': AppID,
  },
})

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

export const apolloPlugin = {
  install(app: App) {
    app.provide(DefaultApolloClient, apolloClient)
  },
}
