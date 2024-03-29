<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps({
    type: {type: String, required: true},
    placeholder: {type: String, required: true},
    autocomplete: {type: String, default: "off"},
    errorExist: {type: Boolean, requried: true},
    id: {type: String, required: true},
    inputTitle: {type: String, required: true},
    modelValue: {type: [String, Number]},
});
const emits = defineEmits(["update:modelValue"]);
const errorExist = ref<Boolean>(false);
const value = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emits('update:modelValue', value);
    }
});

watch(()=>props.errorExist, (newValue)=>{
    errorExist.value = newValue;
})

</script>
<template>
    <div class="subscribe-input-field-container">
        <label :for="props.id">{{ props.inputTitle }}: </label>
        <input :type="$props.type" :placeholder="props.placeholder" :autocomplete="props.autocomplete" :style="{'border-color': errorExist ? 'red' : ''}" :id="props.id" v-model="value">
    </div>
</template>
<style scoped>
.subscribe-input-field-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

input[type="text"], input[type="password"], input[type="number"] {
  border: 0.15rem solid #ccc;
  outline: none;
  transition: 0.1s;
  height: 2rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  padding: 0 0.5rem 0 0.5rem;
}

input[type="text"]:focus, input[type="password"]:focus, input[type="number"]:focus {
  border: 0.15rem solid #555;
} 
</style>