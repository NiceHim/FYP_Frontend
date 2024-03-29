<template>
    <div class="loader"></div>
</template>
<script setup lang="ts">

</script>
<style scoped>
.loader {
  position: absolute;
  width: 3.2rem;
  padding: 0.5rem;
  top: calc((100% - 0.5rem - 3.2rem) / 2);
  left: calc((100% - 0.5rem - 3.2rem) / 2);
  aspect-ratio: 1;
  border-radius: 50%;
  background: deepskyblue;
  --_m: 
    conic-gradient(#0000 10%,#000),
    linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
          mask: var(--_m);
  -webkit-mask-composite: source-out;
          mask-composite: subtract;
  animation: l3 0.5s infinite linear;
}

@keyframes l3 {to{transform: rotate(1turn)}}
</style>