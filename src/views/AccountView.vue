<script setup lang="ts">
import { ref } from 'vue';
import type IBalanceRecord from "@/models/balanceRecord";
import {type ICurrentSubscription, type IHistorySubscription} from '@/models/subscription';
import DataTable from '@/components/DataTable.vue';
import { getBalanceRecord, getHistoryTransaction } from '@/api/user';
import { getCurrentSubscription, getHistorySubscription, stopSubscription } from "@/api/subscription";
import { useAuthStore } from '@/stores/auth';
import { useSubscribeStore } from '@/stores/subscribe';
import type ITransaction from '@/models/transaction';

const emits = defineEmits(["addNotification"])
const authStore = useAuthStore();
const subscribeStore = useSubscribeStore();
const itemsBalanceRecord = ref<Array<IBalanceRecord>>([]);
const itemsCurrentSubscription = ref<Array<ICurrentSubscription>>([]);
const itemsHistorySubscription = ref<Array<IHistorySubscription>>([]);
const itemsHistoryTransaction = ref<Array<ITransaction>>([]);
await loadData();

async function loadData() {
  try {
    [itemsBalanceRecord.value, itemsCurrentSubscription.value, 
    itemsHistorySubscription.value, itemsHistoryTransaction.value] = await Promise.all([getBalanceRecord(authStore.token), getCurrentSubscription(authStore.token), 
    getHistorySubscription(authStore.token), getHistoryTransaction(authStore.token)]);
  } catch (error) {
    console.log(error);
  }
}

async function stopTickerSubscription(item: ICurrentSubscription) {
  subscribeStore.showStopSubscriptionModal = true;
  subscribeStore.ticker = item.ticker;
  subscribeStore.lot = item.lot;
  subscribeStore.createdAt = item.createdAt;
}

</script>
<template>
    <div class="account-view-cotainer">
        <DataTable :items="itemsBalanceRecord" :title="'Balance Record'" :hearders="['Action', 'Amount', 'CreatedAt (UTC+0)']"/>
        <DataTable :items="itemsCurrentSubscription" :title="'Current Subscription'" :hearders="['Ticker', 'Lot', 'Status', 'CreatedAt (UTC+0)', 'Actions']">
          <template #actions="{ item }">
            <div class="stop-icon-container">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" @click="stopTickerSubscription(item)">
                <path d="M320-320h320v-320H320v320ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
              </svg>
            </div>
          </template>
        </DataTable>
        <DataTable :items="itemsHistorySubscription" :title="'History Subscription'" :hearders="['Ticker', 'Lot', 'Status', 'CreatedAt (UTC+0)', 'EndedAt (UTC+0)']"/>
        <DataTable :items="itemsHistoryTransaction" :title="'History Transaction'" :hearders="['Ticker', 'Price', 'Lot', 'Action', 'PnL', 'CreatedAt (UTC+0)', 'EndedAt (UTC+0)']"/>
    </div>
</template>
<style scoped>
::-webkit-scrollbar {
  width: 0.3rem;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}

.account-view-cotainer {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  overflow-y: scroll;
  height: 100%;
  width: 100%;
  padding: 1rem;
}

.stop-icon-container {
  height: 1rem;
  width: 1rem;
  margin-left: auto;
  margin-right: auto;
}

.stop-icon-container svg {
  display: block;
  height: inherit;
  width: inherit;
}

.stop-icon-container svg:hover {
  fill: red;
}

</style>