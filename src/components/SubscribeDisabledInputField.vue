<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    type: {type: String, required: true},
    value: {type: String, required: true},
    id: {type: String, required: true},
    inputTitle: {type: String, required: true},
    modelValue: {type: [String, Number]},
});

</script>
<template>
  <div class="subscribe-disabled-input-field-container">
    <span>{{ props.inputTitle }}: </span>
    <input :id="props.id" :type="props.type" :value="props.value" disabled>
  </div>
</template>
<style scoped>
.subscribe-disabled-input-field-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

input[type="text"], input[type="password"] {
  border: 0.15rem solid #ccc;
  outline: none;
  transition: 0.1s;
  height: 2rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  padding: 0 0.5rem 0 0.5rem;
}

input[type="text"]:focus, input[type="password"]:focus {
  border: 0.15rem solid #555;
}    
</style>