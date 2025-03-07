<script setup lang="ts">

import PositionsDataTable from '@/components/PositionsDataTable.vue';
import { useTradingDataWebSocketStore } from '@/stores/tradingDataWebSocket';

const tradingDataWebSocketStore = useTradingDataWebSocketStore();

</script>
<template>
    <div class="positions-view-container">
        <PositionsDataTable :items="tradingDataWebSocketStore.currentTransaction" :title="'Positions'" :hearders="['Ticker', 'Action', 'Lot', 'Initial Price', 'PnL', 'CreatedAt (UTC+0)']"/>
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