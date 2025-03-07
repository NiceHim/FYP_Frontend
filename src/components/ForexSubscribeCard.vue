<script setup lang="ts">
import { ref, reactive, watch, type PropType } from 'vue';
import AreaSerisChart from './AreaSerisChart.vue';
import { type ILastQuote, type IQuote } from '@/models/quote';
import { useSubscribeStore } from '@/stores/subscribe';
import { useMarketStore } from '@/stores/market';
import { useForexWebSocketStore } from '@/stores/forexWebSocket';
import type IAreaChartData from '@/models/areaChartData';

const props = defineProps({
    tickerName: {type: String, required: true},
    quote: {type: Object as PropType<ILastQuote>, required: true},
    aggregate: {type: Array<IAreaChartData>, required: true}
});

const marketStore = useMarketStore();
const forexWebSocketStore = useForexWebSocketStore();
const subscribeStore = useSubscribeStore();
const newQuote: ILastQuote = reactive(props.quote);
const percChange = ref<number>(parseFloat((((props.quote.bid - props.aggregate[props.aggregate.length-2].value) /  props.aggregate[props.aggregate.length-2].value) * 100).toFixed(3)));
const tempBuyPrice = ref<number>(props.quote.ask);
const tempSellPrice = ref<number>(props.quote.bid);
const colorOfBuyPrice = ref<string>("gray");
const colorOfSellPrice = ref<string>("gray");
const colorOfTodaysPercChange = ref<string>(marketStore.marketStatus?.currencies.fx == "open" ? percChange.value >= 0 ? "green" : "red" : "gray");

function setSubscribeStore(ticker: string) {
    subscribeStore.showSubscribeModal = true;
    subscribeStore.ticker = ticker;
}

watch(()=>forexWebSocketStore.state.forexMap.get(props.tickerName), (newValue)=>{
    if (newValue) {
        colorOfBuyPrice.value = newValue.a > tempBuyPrice.value ? "green" : newValue.a < tempBuyPrice.value ? "red" : "gray";
        colorOfSellPrice.value = newValue.b > tempSellPrice.value ? "green" : newValue.b < tempSellPrice.value ? "red" : "gray";
        tempBuyPrice.value = newValue.a;
        newQuote.ask = newValue.a;
        tempSellPrice.value = newValue.b;
        newQuote.bid = newValue.b;
        newQuote.timestamp = newValue.t;
        percChange.value = parseFloat((((newValue.b - props.aggregate[props.aggregate.length-2].value) /  props.aggregate[props.aggregate.length-2].value) * 100).toFixed(3));
        colorOfTodaysPercChange.value = marketStore.marketStatus?.currencies.fx == "open" ? percChange.value >= 0 ? "green" : "red" : "gray";
    }
})


</script>
<template>
    <div class="forex-subscribe-card-conatiner">
        <div class="forex-data-container">
            <div>
                <span>{{ props.tickerName }} </span>
                <span :style="{color: colorOfTodaysPercChange}">({{ (percChange >= 0 ? '+' : '') + percChange.toFixed(3) + '%' }})</span>
            </div>
            <AreaSerisChart :tickerName="props.tickerName" :width="'10rem'" :height="'60%'" :newQuote="newQuote" :aggregate="aggregate" :priceStatus="colorOfTodaysPercChange"/>
        </div>
        <div class="price-desc-col-container" >
                <span>Buy Price</span>
                <span :style="{color: colorOfBuyPrice}">{{ tempBuyPrice }}</span>
        </div>
        <div class="price-desc-col-container">
                <span>Sell Price</span>
                <span :style="{color: colorOfSellPrice}">{{ tempSellPrice }}</span>
        </div>
        <button @click="setSubscribeStore(props.tickerName.replace('/', ''))"><span>Subscribe</span></button>
    </div>
</template>
<style scoped>
.forex-subscribe-card-conatiner {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 5rem;
    width: 100%;
    border-radius: 0.5rem;
    background-color: white;
    box-shadow: 0 0 0.5rem lightgray;
}

.forex-subscribe-card-conatiner span {
    font-size: 1rem;
}

.forex-data-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.price-desc-col-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

button {
    border: none;
    border-radius: 0.5rem;
    width: 5rem;
    height: 2.5rem;
    background-color: lime;
    transition: all 0.3s;
}

button:hover {
    box-shadow: 0 0 0.5rem black;
}    
</style>