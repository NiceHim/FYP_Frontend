<script setup lang="ts">
const props = defineProps({
    value: {type: String, required: true}
})
</script>
<template>
    <input type="submit" :value="props.value">
</template>
<style scoped>
input[type="submit"] {
  border: none;
  border-radius: 0.5rem;
  height: 2rem;
  font-size: 1rem;
  background-color: lime;
  margin-top: 1rem;
  padding: 0 0.5rem 0 0.5rem;
  transition: all 0.3s;
}

input[type="submit"]:hover {
  box-shadow: 0rem 0rem 0.5rem black;
}
</style>