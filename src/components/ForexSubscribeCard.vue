<script setup lang="ts">
import { ref, reactive, watch, type PropType } from 'vue';
import AreaSerisChart from './AreaSerisChart.vue';
import type { IQuote } from '@/models/quote';
import { useSubscribeStore } from '@/stores/subscribe';
import { useMarketStore } from '@/stores/market';
import type IAreaChartData from '@/models/areaChartData';

const props = defineProps({
    tickerName: {type: String, required: true},
    quote: {type: Object as PropType<IQuote>, required: true},
    aggregate: {type: Array<IAreaChartData>, required: true}
});

let newQuote: IQuote = reactive(props.quote);
const marketStore = useMarketStore();
const subscribeStore = useSubscribeStore();
const percChange = ref<number>(parseFloat((((props.quote.b - props.aggregate[props.aggregate.length-2].value) /  props.aggregate[props.aggregate.length-2].value) * 100).toFixed(3)));
const tempBuyPrice = ref<number>(props.quote.a);
const tempSellPrice = ref<number>(props.quote.b);
const colorOfBuyPrice = ref<string>("gray");
const colorOfSellPrice = ref<string>("gray");
const colorOfTodaysPercChange = ref<string>(marketStore.marketStatus?.currencies.fx == "open" ? percChange.value >= 0 ? "green" : "red" : "gray");

function setSubscribeStore(ticker: string) {
    subscribeStore.showSubscribeModal = true;
    subscribeStore.ticker = ticker;
}

watch(()=>props.quote.a, (newValue)=>{
    if (newValue > tempBuyPrice.value) {
        colorOfBuyPrice.value = "green";
    } else if (newValue < tempBuyPrice.value) {
        colorOfBuyPrice.value = "red";
    } else {
        colorOfBuyPrice.value = "gray";
    }
    tempBuyPrice.value = newValue;
})

watch(()=>props.quote.b, (newValue)=>{
    if (newValue > tempSellPrice.value) {
        colorOfSellPrice.value = "green";
    } else if (newValue < tempSellPrice.value) {
        colorOfSellPrice.value = "red";
    } else {
        colorOfSellPrice.value = "gray";
    }
    tempSellPrice.value = newValue;
    percChange.value = parseFloat((((newValue - props.aggregate[props.aggregate.length-2].value) /  props.aggregate[props.aggregate.length-2].value) * 100).toFixed(3));
    colorOfTodaysPercChange.value = marketStore.marketStatus?.currencies.fx == "open" ? percChange.value >= 0 ? "green" : "red" : "gray";
})

</script>
<template>
    <div class="forex-subscribe-card-conatiner">
        <div class="forex-data-container">
            <div>
                <span>{{ props.tickerName }} </span>
                <span :style="{color: colorOfTodaysPercChange}">({{ (percChange >= 0 ? '+' : '') + percChange.toFixed(3) + '%' }})</span>
            </div>
            <AreaSerisChart :tickerName="props.tickerName" :width="'10rem'" :height="'60%'" :newQuote="newQuote" :priceStatus="colorOfTodaysPercChange"/>
        </div>
        <div class="price-desc-col-container" >
                <span>Buy Price</span>
                <span :style="{color: colorOfBuyPrice}">{{ props.quote.a }}</span>
        </div>
        <div class="price-desc-col-container">
                <span>Sell Price</span>
                <span :style="{color: colorOfSellPrice}">{{ props.quote.b }}</span>
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