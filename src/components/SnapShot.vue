<script setup lang="ts">
import { ref, type PropType, watch } from "vue";
import flagName from "@/utils/flagName"
import { useMarketStore } from "@/stores/market";
import type { ILastQuote, IQuote } from "@/models/quote";
import type IAreaChartData from "@/models/areaChartData";
import { useForexWebSocketStore } from "@/stores/forexWebSocket";

const props = defineProps({
    ticker: {type: String, required: true},
    quote: {type: Object as PropType<ILastQuote>, required: true},
    aggregate: {type: Array<IAreaChartData>, required: true}
})

const marketStore = useMarketStore();
const forexWebSocketStore = useForexWebSocketStore();
const ticker = props.ticker.replace("C:", "");
const currency1 = ticker.slice(0, 3);
const currency2 = ticker.slice(4, 7);
// @ts-ignore
const flagName1 = flagName[currency1];
// @ts-ignore
const flagName2 = flagName[currency2];
// const snapShotData = ref<Snapshot>()
const percChange = ref<number>(parseFloat((((props.quote.bid - props.aggregate[props.aggregate.length-2].value) /  props.aggregate[props.aggregate.length-2].value) * 100).toFixed(3)) );
const tempSellPrice = ref<number>(props.quote.bid);
const colorOfSellPrice = ref<string>("gray");
const colorOfTodaysPercChange = ref<string>(marketStore.marketStatus?.currencies.fx == "open" ? percChange.value >= 0 ? "green" : "red" : "gray");

watch(()=>forexWebSocketStore.state.forexMap.get(ticker), (newValue: IQuote) => {
    updateDOM(newValue.b);
})

async function updateDOM(newValue: number) {
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
}

</script>
<template>
    <div class="snapshot-container">
        <div class="flag-container">
            <img
                :alt="`${currency1}`"
                :src="`http://purecatamphetamine.github.io/country-flag-icons/3x2/${flagName1}.svg`"
            />
            <img
                :alt="`${currency2}`"
                :src="`http://purecatamphetamine.github.io/country-flag-icons/3x2/${flagName2}.svg`"
            />
            <span>{{ ticker }}</span>
            <div :class="{'market-status-indicator-on': marketStore.marketStatus?.currencies.fx=='open', 'market-status-indicator-off': marketStore.marketStatus?.currencies.fx=='closed'}"></div>
        </div>
        <div class="data-content-container">
            <span :style="{color: colorOfSellPrice}">{{ tempSellPrice }}</span>
            <span :style="{color: colorOfTodaysPercChange}">{{ (percChange >= 0 ? '+' : '') + percChange.toFixed(3) + '%' }}</span>
        </div>
    </div>
</template>

<style scoped>
.snapshot-container {
    position: relative;
    display: grid;
    padding: 0.5rem;
    width: 10rem;
    height: 4rem;
    background-color: #f2f2f2;
    border-radius: 0.5rem;
    box-shadow: 0rem 0rem 0.5rem gray;
}   

.flag-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    column-gap: 0.3rem;
}

.flag-container span {
    font-size: 0.8rem;
    font-weight: 600;
}

.data-content-container {
    display: flex;
    justify-content: space-between;
}

.data-content-container span {
    font-size: 0.8rem;
}

img {
    width: 1.5rem;
    /* object-fit: scale-down; */
    border-radius: 0.5rem;
}

.market-status-indicator-on {
    border-radius: 100%;
    background-color: lime;
    height: 0.5rem;
    width: 0.5rem;
}

.market-status-indicator-off {
    border-radius: 100%;
    background-color: red;
    height: 0.5rem;
    width: 0.5rem;
}

.increase-color {
    color: green;
}

.decrease-color {
    color: red;
}
</style>