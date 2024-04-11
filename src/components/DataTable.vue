<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';

const props = defineProps({
    items: {type: Array<any>, required: true},
    title: {type: String, required: true},
    hearders: {type: Array, required: true}
})
const dataTableContainer = ref<HTMLElement | null>();

onMounted(()=>{
    if (isOverflow(dataTableContainer.value!) == true) {
        dataTableContainer.value!.style.minWidth = "100dvw";
    }
})

const itemsPerPage = 10;
const startIndex = ref<number>(0);
const endIndex = ref<number>(props.items.length >= itemsPerPage ?  itemsPerPage - 1 : props.items.length - 1);
const hover = ref<boolean>(false);
const sliceItems = ref(props.items.slice(startIndex.value, endIndex.value + 1));

function navFirstPage() {
    startIndex.value = 0;
    endIndex.value = props.items.length >= itemsPerPage ?  itemsPerPage - 1 : props.items.length - 1;
    sliceItems.value = props.items.slice(startIndex.value, endIndex.value + 1);
}

function navLastPage() {
    startIndex.value = props.items.length - props.items.length % itemsPerPage;
    endIndex.value = props.items.length - 1;
    sliceItems.value = props.items.slice(startIndex.value, endIndex.value + 1);
}

function navBefore() {
    if (startIndex.value == 0) return;
    endIndex.value = startIndex.value - 1;
    startIndex.value = endIndex.value - itemsPerPage + 1;
    sliceItems.value = props.items.slice(startIndex.value, endIndex.value + 1);
}

function navNext() {
    if (endIndex.value == props.items.length-1) return;
    startIndex.value = endIndex.value + 1;
    if (startIndex.value + itemsPerPage > props.items.length) {
        endIndex.value = props.items.length - 1;
    } else {
        endIndex.value = startIndex.value + itemsPerPage - 1;
    }
    sliceItems.value = props.items.slice(startIndex.value, endIndex.value + 1);
}

function isOverflow(element: HTMLElement) {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}
</script>
<template>
    <div class="data-table-container" ref="dataTableContainer">
        <div class="data-table-header">{{ props.title }}</div>
        <table>
            <tr>
                <th v-for="header in props.hearders">{{ header }}</th>
            </tr>
            <tr v-for="item in sliceItems">
                <td v-for="data in item">{{ data }}</td>
                <td><slot name="actions" v-bind:item="item"></slot></td>
            </tr>
        </table>
        <div class="data-table-footer">
            <div class="pagination-row">
                <span>Page: {{ Math.ceil(endIndex / itemsPerPage) || 1 }}</span>
                <span>{{ startIndex+1 }}-{{ endIndex+1 }} of {{ props.items.length }}</span>
                <div class="pagination-icon-container" @click="navFirstPage" @mouseenter="hover = true" @mouseleave="hover = false" :class="{ 'div-hover': hover }">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                        <path d="M240-240v-480h80v480h-80Zm440 0L440-480l240-240 56 56-184 184 184 184-56 56Z"/>
                    </svg>
                </div>
                <div class="pagination-icon-container" @click="navBefore">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                        <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
                    </svg>
                </div>
                <div class="pagination-icon-container" @click="navNext">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
                    </svg>
                </div>
                <div class="pagination-icon-container" @click="navLastPage">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                        <path d="m280-240-56-56 184-184-184-184 56-56 240 240-240 240Zm360 0v-480h80v480h-80Z"/>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.data-table-container {
  background-color: white;
  border-radius: 0.5rem;
  padding: 0.5rem;
  box-shadow: 0 0 0.5rem lightgray;
}

.data-table-header {
    background-color: lightgray;
    border-radius: 0.5rem;
    padding: 0.5rem;
    font-size: 1.5rem;
    font-weight: bold;
}

table {
  border-collapse: collapse;
  width: 100%;
}

tr {
  border-bottom: 1px solid black;
}

th {
  /* border: 1px solid black; */
  text-align: center;
  padding: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
}

td {
  /* border: 1px solid black; */
  text-align: center;
  padding: 0.5rem;
  font-size: 0.8rem;
}

.pagination-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    column-gap: 1rem;
}

.pagination-icon-container {
  border-radius: 100%;
  height: 1.5rem;
  width: 1.5rem;
  transition: all 0.1s;
}

.pagination-icon-container:hover {
  background-color: lightgray;
}


</style>