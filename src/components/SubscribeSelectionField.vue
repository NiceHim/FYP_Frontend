<script setup lang="ts">
import { computed } from 'vue';


const props = defineProps({
    options: {type: Array<string>, required: true},
    name: {type: String, required: true},
    id: {type: String, required: true},
    inputTitle: {type: String, required: true},
    modelValue: {type: [String, Number]}
});

const emits = defineEmits(["update:modelValue"]);
const value = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emits('update:modelValue', value);
    }
});

</script>
<template>
    <div class="subscribe-input-field-container">
        <label :for="props.id">{{ props.inputTitle }}: </label>
        <select :name="props.name" :id="props.id" v-model="value">
            <option v-for="option in options" :key="option">{{ option }}</option>
        </select>
    </div>
</template>
<style scoped>
.subscribe-input-field-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

select {
  border: 0.15rem solid #ccc;
  outline: none;
  transition: 0.1s;
  height: 2rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  padding: 0 0.5rem 0 0.5rem;
}


</style>