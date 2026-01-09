import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export const useWelcomeQuery = () => {
  const query = gql`
    query ContentStatistics {
      # Количество фильмов
      filmCount: allFilms {
        totalCount
      }

      # Количество персонажей
      peopleCount: allPeople {
        totalCount
      }

      # Количество планет
      planetCount: allPlanets {
        totalCount
      }

      # Количество видов
      speciesCount: allSpecies {
        totalCount
      }

      # Количество звездолетов
      starshipCount: allStarships {
        totalCount
      }

      # Количество транспортных средств
      vehicleCount: allVehicles {
        totalCount
      }
    }
  `
  const { result, loading, error } = useQuery(query)

  return { result, loading, error }
}
