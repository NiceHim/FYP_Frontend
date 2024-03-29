<script setup lang="ts">
import { ref, inject, type PropType } from 'vue';
import { currentTransactionKey } from "@/utils/injectionKey"
import PositionsDataTable from '@/components/PositionsDataTable.vue';

const currentTransaction = inject(currentTransactionKey);

</script>
<template>
    <div class="positions-view-container">
        <PositionsDataTable v-if="currentTransaction" :items="currentTransaction" :title="'Positions'" :hearders="['Ticker', 'Action', 'Lot', 'Initial Price', 'PnL', 'CreatedAt (UTC+0)']"/>
    </div>
</template>
<style scoped>
.positions-view-container {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  height: 100%;
  width: 100%;
  padding: 1rem;
}
</style>