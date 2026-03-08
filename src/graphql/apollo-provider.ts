import { createApolloProvider } from '@vue/apollo-option'
import { apolloClient } from './apollo-tree'

export const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
})
