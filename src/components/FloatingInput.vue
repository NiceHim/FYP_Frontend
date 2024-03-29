<script setup lang="ts">
const props = defineProps({
    type: {type: String, required: true},
    name: {type: String}
})
</script>

<template>
    <div class="floating-input-conatiner">
        <div class="input-container">
            <input :type="props.type" :name="props.name">
            <span>TEST</span>
            <div class="temp"></div>
        </div>
    </div>
</template>

<style scoped>
.floating-input-conatiner .input-container {
    height: 2rem;
    width: inherit;
    position: relative;
}

.floating-input-conatiner .input-container input {
    position: relative;
    display: block;
    background-color: transparent;
    border: none;
    height: 2rem;
    width: 100%;
    font-size: 1rem;
    border-radius: 0.5rem;
    padding: 0 0.5rem 0 0.5rem;
    outline: none;
    z-index: 2;
}


.floating-input-conatiner .input-container span {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 1.5rem;
    transition: 0.5s;
}

.floating-input-conatiner .input-container .temp {
    position: absolute;
    bottom: 0;
    background: #ccc;
    height: 0.2rem;
    width: 100%;
    border-radius: 0.5rem;
    transition: 0.5s;
}

.floating-input-conatiner .input-container input:focus ~ span {
    font-size: 1rem;
    transform: translateY(-1.2rem);
}

.floating-input-conatiner .input-container input:focus ~ div {
    height: 100%;
    background: white;
    border: 0.15rem solid #555;
    z-index: 1;
}
</style>