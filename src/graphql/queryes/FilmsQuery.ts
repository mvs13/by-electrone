import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export const useAllFilmsQuery = () => {
  const allFilmsQuery = gql`
    query allFilmsInfo {
      allFilms {
        films {
          director
          id
          episodeID
          openingCrawl
          characterConnection {
            characters {
              name
              species
            }
          }
        }
      }
    }
  `
  const { result, loading, error } = useQuery(allFilmsQuery)

  return { result, loading, error }
}
