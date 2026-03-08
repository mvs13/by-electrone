<template>
  <h2>Foo Page</h2>
  <p>Route info: {{ currentRoute }}</p>
</template>

<script setup lang="ts">
import router from '@/router'
import { onMounted, ref } from 'vue'

const currentRoute = ref({})

onMounted(() => {
  currentRoute.value = router.currentRoute
})
</script>

<style lang="postcss" scoped></style>
