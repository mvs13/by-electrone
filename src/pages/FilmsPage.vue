<template>
  <ApolloQuery :query="allFilmsQuery">
    <template v-slot="{ result: { error, data }, isLoading }">
      <!-- Loading -->
      <div v-if="isLoading" class="loading apollo">Loading...</div>

      <!-- Error -->
      <div v-else-if="error" class="error apollo">An error occurred</div>

      <!-- Result -->
      <div v-else-if="data" class="result apollo">
        <article v-for="film in data.allFilms.films" v-bind:key="film.id">
          <header>{{ film.title }}</header>
          <div class=""><strong>Director:</strong> {{ film.director }}</div>
          <div><strong>Release Date:</strong> {{ film.releaseDate }}</div>
          <details :name="`crawl-${film.episodeID}#`">
            <summary>openingCrawl</summary>
            <div class="">{{ film.openingCrawl }}</div>
          </details>
          <!-- <pre>{{ JSON.stringify(film.characterConnection, null, '  ') }}</pre> -->
          <details v-if="film.characterConnection?.characters.length > 0" :name="`characters-${film.episodeID}#`">
            <summary>Characters</summary>
            <ul>
              <li v-for="character in film.characterConnection?.characters" :key="character.id">
                {{ character.name }}
              </li>
            </ul>
          </details>
        </article>
        <!-- <pre>{{ JSON.stringify(data, null, '  ') }}</pre> -->
      </div>

      <!-- No result -->
      <div v-else class="no-result apollo">No result :(</div>
    </template>
  </ApolloQuery>
</template>

<script setup lang="ts">
import gql from 'graphql-tag'

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
            id
          }
        }
      }
    }
  }
`
</script>
