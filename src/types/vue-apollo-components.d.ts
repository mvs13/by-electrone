declare module '@vue/apollo-components' {
  import { PluginFunction } from 'vue'

  export const ApolloQuery: unknown
  export const ApolloMutation: unknown
  export const ApolloSubscribeToMore: unknown
  export const ApolloProvider: unknown

  const VueApolloComponents: PluginFunction<unknown>
  export default VueApolloComponents
}
