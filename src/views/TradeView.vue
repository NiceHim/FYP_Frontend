<script setup lang="ts">
import { ref, onUnmounted, onBeforeMount } from 'vue';
import { type IReducedLastQuote } from '@/models/quote';
import { type IReducedAggregate } from '@/models/aggregate';
import ForexSubscribeCard from '@/components/ForexSubscribeCard.vue';
import dayjs from 'dayjs';
import { getAllLastQuotes, getAllAggregates } from "@/api/market";
import { useMarketStore } from '@/stores/market';
import { useForexWebSocketStore } from '@/stores/forexWebSocket';

const marketStore = useMarketStore();
const forexWebSocketStore = useForexWebSocketStore();
const lastQuotes = ref<Array<IReducedLastQuote>>([]);
const aggregates = ref<Array<IReducedAggregate>>([]);

await loadData();

onBeforeMount(() => {
    if (marketStore.marketStatus?.currencies.fx == "open") {
        forexWebSocketStore.connect();
    }
})

onUnmounted(()=>{
    forexWebSocketStore.disconnect();
})

async function loadData() {
    try {
        [lastQuotes.value, aggregates.value] = await Promise.all(
            [ 
                getAllLastQuotes(), 
                getAllAggregates(1, "day", dayjs().subtract(30, "day").format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD"))
            ]
        );
    } catch (error) {
        console.log(error);
    }
}


</script>
<template>
    <div class="trade-view-container">
        <ForexSubscribeCard 
            v-for="(lastQuote, index) in lastQuotes"
            :tickerName="lastQuote.symbol" 
            :quote="lastQuote.last"
            :aggregate="aggregates[index].results"
        />
    </div>
</template>
<style scoped>
.trade-view-container {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

</style>