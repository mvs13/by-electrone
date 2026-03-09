<template>
  <nav>
    <ul>
      <li>
        <RouterLink to="/">
          <strong>SWAPI</strong>
        </RouterLink>
      </li>
    </ul>
    <ul>
      <li v-for="item in navRoutes" v-bind:key="item.route">
        <RouterLink :to="item.route">
          {{ item.title }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import router from '../router'

const navRoutes: { route: string; title: string }[] = reactive([])

onMounted(async () => {
  await router.isReady()
  router.getRoutes().forEach((r) => {
    if (r.meta?.parent === 'list') {
      navRoutes.push({
        route: r.path,
        title: (r.meta?.title as string) || '',
      })
    }
  })
  // console.log('🚀 ~ navRoutes:', navRoutes)
})
</script>

<style lang="postcss" scoped></style>
