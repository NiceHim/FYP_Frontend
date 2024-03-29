<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, inject, type PropType } from 'vue';
import { createChart, type IChartApi } from 'lightweight-charts';
import { areaChartDataKey } from "@/utils/injectionKey";
import { useMarketStore } from '@/stores/market';
import type { IQuote } from '@/models/quote';
import dayjs from 'dayjs';

const props = defineProps({
    tickerName: {type: String, required: true},
    width: {type: String, required: true},
    height: {type: String, required: true},
    newQuote: {type: Object as PropType<IQuote>, required: true},
    priceStatus: {type: String, required: true}
})
const marketStore = useMarketStore();
let chartOptions = { 
    layout: {
        background: {color: '#FFFFFF'}
    },
    grid: {
        vertLines: { visible: false },
        horzLines: { visible: false }
    },
    handleScroll: false,
    handleScale: false,
    kineticScroll: { touch: false, mouse: false},
    rightPriceScale: { visible: false},
    timeScale: { visible: false},
    crosshair: { mode: 2 }
};
let areaOptionsIncreasing = { lineColor: '#32CD32', topColor: '#00FF00', bottomColor: 'rgba(0, 255, 0, 0.28)', priceLineVisible: false };
let areaOptionsDecreasing = { lineColor: '#DC143C', topColor: '#FF0000', bottomColor: 'rgba(255, 0, 0, 0.28)', priceLineVisible: false };
let areaOptionsMarketOff = { lineColor: '#808080', topColor: '#D3D3D3', bottomColor: 'rgba(211, 211, 211, 0.28)', priceLineVisible: false };


const data = inject(areaChartDataKey);

let chart: IChartApi | null;
let areaSeries: any;
const chartContainer = ref();

const resizeHandler = () => {
	if (!chart || !chartContainer.value) return;
	const dimensions = chartContainer.value.getBoundingClientRect();
	chart.resize(dimensions.width, dimensions.height);
    chart.timeScale().fitContent();
};

onMounted(() => {
    chart = createChart(chartContainer.value, chartOptions);
    if (props.priceStatus == "gray") {
        areaSeries = chart.addAreaSeries(areaOptionsMarketOff);
    } else if (props.priceStatus == "green") {
        areaSeries = chart.addAreaSeries(areaOptionsIncreasing);
    } else {
        areaSeries = chart.addAreaSeries(areaOptionsDecreasing);
    }
    // @ts-ignore
    areaSeries.setData(data[props.tickerName].aggregate);
    chart.timeScale().fitContent();
    window.addEventListener('resize', resizeHandler);
});

onUnmounted(() => {
    if (chart) {
        chart.remove();
        chart = null;
    }
    window.removeEventListener('resize', resizeHandler);
});

watch(()=>props.newQuote, (newValue)=>{
    areaSeries.update({time: dayjs(newValue.t).format("YYYY-MM-DD"), value: newValue.b})
}, {deep: true})

watch(
    ()=> data,
    (newData) => {
        if (!areaSeries) return;
        areaSeries.setData(newData);
    }
)

watch(()=>props.priceStatus, (newValue)=>{
    if (chart) {
        if (newValue == "gray") {
            areaSeries.applyOptions(areaOptionsMarketOff);
        } else if (newValue == "green") {
            areaSeries.applyOptions(areaOptionsIncreasing);
        } else {
            areaSeries.applyOptions(areaOptionsDecreasing);
        }
    }
})
</script>
<template>
    <div class="lw-chart" ref="chartContainer" :style="{width: props.width, height: props.height}"></div>
</template>
<style scoped>
</style>