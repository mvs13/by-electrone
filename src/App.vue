<script setup lang="ts">
import NavbarHorizontal from './components/NavbarHorizontal.vue'
</script>

<template>
  <h1>Star Wars API using example</h1>
  <main class="container">
    <NavbarHorizontal />
    <router-view />
  </main>
</template>
