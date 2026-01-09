const APIURI = 'https://swapi-graphql.netlify.app/graphql'
const AppID = 'swapi'
// Based on https://medium.com/accor-digital-and-tech/using-graphql-with-vue-js-3-909ccb60fc82

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core'
import type { App, Plugin } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'

// HTTP connection to the API
const createHttpLink = () =>
  new HttpLink({
    // URI to use when fetching operations.
    uri: APIURI,
    // Headers to be sent on each request.
    headers: {
      // apiKey: 'c0944e06-4965-49fa-b049-773466b2608a',
      'app-id': AppID,
    },
  })

// Create the apollo client
const createApolloClient = (app: App) => {
  // Cache implementation
  const cache = new InMemoryCache()

  const link = createHttpLink()

  // Apollo client options
  const apolloConfig = { link, cache }

  return new ApolloClient(apolloConfig)
}

// Create a Vue plugin to "provide" an Apollo client to app
const createPlugin = () => {
  const plugin: Plugin = {
    install: (app: App) => {
      const apolloClient = createApolloClient(app)
      app.provide(DefaultApolloClient, apolloClient)
    },
  }

  return plugin
}

const apolloPlugin = createPlugin()

export { apolloPlugin }
