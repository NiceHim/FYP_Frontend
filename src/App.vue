<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import LoadingSpinner from './components/LoadingSpinner.vue';
</script>

<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->
  <RouterView v-slot="{ Component }">
    <Suspense timeout="0">
        <template #default>
            <component :is="Component"></component>
        </template>
        <template #fallback>
            <LoadingSpinner/>
        </template>
    </Suspense>
  </RouterView>
</template>

<style scoped>

</style>
