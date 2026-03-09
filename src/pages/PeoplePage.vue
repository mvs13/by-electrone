<template>
  <ApolloQuery :query="allPeopleQuery">
    <template v-slot="{ result: { error, data }, isLoading }">
      <!-- Loading -->
      <div v-if="isLoading" class="loading apollo">Loading...</div>

      <!-- Error -->
      <div v-else-if="error" class="error apollo">An error occurred</div>

      <!-- Result -->
      <div v-else-if="data" class="result apollo">
        <h2>All people count: {{ data.allPeople.totalCount }}</h2>

        <ul>
          <li v-for="person in data.allPeople.people" :key="person.id">{{ person.name }}</li>
        </ul>
        <!-- <pre>{{ JSON.stringify(data, null, '  ') }}</pre> -->
      </div>

      <!-- No result -->
      <div v-else class="no-result apollo">No result :(</div>
    </template>
  </ApolloQuery>
</template>

<script setup lang="ts">
import gql from 'graphql-tag'

const allPeopleQuery = gql`
  query allPeopleInfo {
    allPeople {
      totalCount
      people {
        name
        id
      }
    }
  }
`
</script>
