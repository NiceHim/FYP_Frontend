<script setup lang="ts">
import { ref, reactive, provide, onUnmounted, onBeforeMount } from 'vue';
import { areaChartDataKey } from "@/utils/injectionKey"
import type IAreaChartData from '@/models/areaChartData';
import { type IDetailedQuote, type ILastQuote } from '@/models/quote';
import ForexSubscribeCard from '@/components/ForexSubscribeCard.vue';
import dayjs from 'dayjs';
import { getLastQuoteAndAggregate } from "@/api/market";
import { useMarketStore } from '@/stores/market';

let websocket: WebSocket | null = null;
const marketStore = useMarketStore();
const ticker = "C:EURUSD";
const realTimeData = reactive({
    "EUR/USD": {
        quote: {
            a: 0,                   //buy price
            b: 0,                   //sell price
            t: 0,                   //timestamp
        },
        aggregate: ref<Array<IAreaChartData>>([])
    }
})

await loadData();

provide(areaChartDataKey, realTimeData);  

onBeforeMount(() => {
    if (marketStore.marketStatus?.currencies.fx == "open") {
        websocket = new WebSocket(import.meta.env.VITE_WEBSOCKET_BACKEND+"ws/forex.quote.data");
    }
    if (websocket != null) {
        websocket.addEventListener("message", (event)=>{
            const data: IDetailedQuote = JSON.parse(event.data);
            // @ts-ignore
            realTimeData[data.p].quote.a = data.a;
            // @ts-ignore
            realTimeData[data.p].quote.b = data.b;
            // @ts-ignore
            realTimeData[data.p].quote.t = data.t;
        })
    }
})

onUnmounted(()=>{
    if (websocket != null) {
        websocket.close();
        websocket.removeEventListener("message", (event)=>{
            const data: IDetailedQuote = JSON.parse(event.data);
            // @ts-ignore
            realTimeData[data.p].a = data.a;
            // @ts-ignore
            realTimeData[data.p].b = data.b;
            // @ts-ignore
            realTimeData[data.p].t = data.t;    
        });
    }
})

async function loadData() {
    try {
        const result = await getLastQuoteAndAggregate("C:EURUSD", 1, "day", dayjs().subtract(30, "day").format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD"));
        realTimeData['EUR/USD'].quote.a = result['EUR/USD'].quote.ask;
        realTimeData['EUR/USD'].quote.b = result['EUR/USD'].quote.bid;
        // const result: Array<IAggregate> = await getAggregateData("C:EURUSD", 1, "day", dayjs().subtract(30, "day").format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD"));
        realTimeData['EUR/USD'].aggregate = result['EUR/USD'].aggregate.reduce((filtered: any[], data: any)=>{
            if (dayjs(data.t).day() != 0 && dayjs(data.t).day() != 6) {
                filtered.push({value: data.c, time: dayjs(data.t).format("YYYY-MM-DD")})
            }
            return filtered;
        }, []);
        // realTimeData['EUR/USD'].aggregate = result.map(obj => ({value: obj.c, time: dayjs(obj.t).format("YYYY-MM-DD")})); 
        // const lastQuote: ILastQuote = await getLastQuote("EUR", "USD");
        // data.value = result.map(obj => ({value: obj.c, time: dayjs(obj.t).format("YYYY-MM-DD")}));
        // realTimeData['EUR/USD'].quote.a = lastQuote.ask;
        // realTimeData['EUR/USD'].quote.b = lastQuote.bid;
        // realTimeData['EUR/USD'].quote.t = lastQuote.timestamp;
    } catch (error) {
        console.log(error);
    }
}


</script>
<template>
    <div class="trade-view-container">
        <ForexSubscribeCard 
            :tickerName="'EUR/USD'" 
            :quote="realTimeData['EUR/USD'].quote"
            :aggregate="realTimeData['EUR/USD'].aggregate"
        />
    </div>
</template>
<style scoped>
.trade-view-container {
    padding: 1rem;
}

</style>