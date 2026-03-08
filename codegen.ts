import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'https://swapi-graphql.netlify.app/.netlify/functions/index', // Публичный API Star Wars
  documents: ['src/**/*.vue', 'src/**/*.ts'], // Где искать ваши GraphQL-запросы
  ignoreNoDocuments: true, // Позволяет запустить генерацию без предварительных запросов
  generates: {
    './src/gql/': {
      preset: 'client', // Используем client-preset
      presetConfig: {
        gqlTagName: 'gql', // Название функции-тега для запросов
      },
    },
  },
}
export default config
