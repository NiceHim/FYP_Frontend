<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
    status: {type: String, required: true},
    text: {type: String, required: true},
    height: {type: Number, required: true},
    top: {type: Number, required: true}
})
const emits = defineEmits(["deleteElement"]);
const notificationContainer = ref<HTMLElement>();
const notificationHeight = ref<number>(0);
const temp = ref<string>("wwww");

onMounted(() => {
    notificationContainer.value!.style.height = props.height?.toString() + "rem";
    notificationContainer.value!.style.top = props.top?.toString() + "rem";
    notificationHeight.value = notificationContainer.value!.offsetHeight;
})

watch(()=>props.top, (newValue)=>{
    notificationContainer.value!.style.top = (newValue)?.toString() + "rem";
})


defineExpose({
    notificationHeight,
    temp
})
</script>
<template>
    <div class="notification-container" ref="notificationContainer" :style="{backgroundColor: status == 'Error' ? 'pink' : 'lightgreen'}">
        {{ text }}
    </div>
</template>
<style scoped>
.notification-container {
    position: absolute;
    text-align: left;
    font-size: 1rem;
    /* height: max-content; */
    width: 15rem;
    border-radius: 0.5rem;
    top: 0;
    right: 0.5rem;
    /* margin-right: 0.5rem; */
    padding: 0.5rem;
    transition: all 0.2s ease;
}
</style>