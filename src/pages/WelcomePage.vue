<template>
  <h2>Server status</h2>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <ul>
      <li v-for="item in contentStatistics" v-bind:key="item.key">
        {{ item.key + ': ' + item.content }}
      </li>
    </ul>
    <!-- <pre>{{ JSON.stringify(result, null, '  ') }}</pre> -->
  </div>
</template>

<script setup lang="ts">
import { useWelcomeQuery } from '@/graphql/queryes/WelcomeQuery'
import { reactive, watch } from 'vue'

enum statisticsKey {
  filmCount = 'Films',
  peopleCount = 'People',
  planetCount = 'Planets',
  speciesCount = 'Species',
  starshipCount = 'Starships',
  vehicleCount = 'Vehicles',
}

const contentStatistics: {
  key: string
  content: string
}[] = reactive([])

const { result, loading, error } = useWelcomeQuery()

watch(result, (value) => {
  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      const item: { key: string; content: string } = {
        key: statisticsKey[key as keyof typeof statisticsKey],
        content: (value[key] as { __typename: string; totalCount: number }).totalCount.toString(),
      }
      contentStatistics.push(item)
    }
  }
})
</script>
