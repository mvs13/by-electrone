const APIURI = 'https://swapi-graphql.netlify.app/graphql'

// Based on https://v4.apollo.vuejs.org/guide/installation.html
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { HttpLink } from '@apollo/client/link/http'

// HTTP connection to the API
const apiLink = new HttpLink({
  // You should use an absolute URL here
  uri: APIURI,
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
  link: apiLink,
  cache,
})

export { apolloClient }
