<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { onBeforeMount, onUnmounted, ref, reactive, onMounted } from "vue";
import { getMarketStatus, getAllLastQuotes, getAllAggregates } from "@/api/market";
import SnapShot from '@/components/SnapShot.vue';
import { useMarketStore } from '@/stores/market';
import { useForexWebSocketStore } from '@/stores/forexWebSocket';
import type IAreaChartData from '@/models/areaChartData';
import type { IDetailedQuote, IReducedLastQuote } from '@/models/quote';
import type { IReducedAggregate } from '@/models/aggregate';
import dayjs from 'dayjs';

let websocket: WebSocket | null = null;
const marketStore = useMarketStore();
const forexWebSocketStore = useForexWebSocketStore();
const isShow = ref<boolean>(false);
const snapShotContainerWrap = ref<HTMLElement | null>(null);
const lastQuotes = ref<Array<IReducedLastQuote>>([]);
const aggregates = ref<Array<IReducedAggregate>>([]);


await loadData();

onBeforeMount(() => {
    if (marketStore.marketStatus?.currencies.fx == "open") {
      forexWebSocketStore.connect();
    }
})

onMounted(() => {
  window.addEventListener("resize", () => {
    snapShotContainerWrap.value!.style.overflowX = isOverflow(snapShotContainerWrap.value!) ? "scroll" : "";
  })
  if (isOverflow(snapShotContainerWrap.value!) == true) {
      snapShotContainerWrap.value!.style.overflowX = "scroll";
  }
})

onUnmounted(() => {
  forexWebSocketStore.disconnect();
  window.removeEventListener("resize", () => {
    snapShotContainerWrap.value!.style.overflowX = isOverflow(snapShotContainerWrap.value!) ? "scroll" : "";
  })
})

function isOverflow(element: HTMLElement) {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

async function loadData() {
  try {
    marketStore.marketStatus = await getMarketStatus();
    [lastQuotes.value, aggregates.value] = await Promise.all(
        [
            getAllLastQuotes(),
            getAllAggregates(1, "day", dayjs().subtract(5, "day").format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD"))
        ]
    );
  } catch (error) {
    console.log(error);
  }
}

setTimeout(()=>{
  isShow.value = true;
}, 100)
</script>
<template>
  <div class="home-view-container">
    <div class="header-container">
      <RouterLink to="/login">
        <div class="user-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
          </svg>
        </div>
      </RouterLink>
    </div>
    <div class="main-content-container">
      <div class="title">
        <Transition name="fade"> 
          <span v-show="isShow">Deep Reinforcement Learning</span>
        </Transition>
        <Transition name="fade2">
          <span v-show="isShow">Auto Trading Platform</span>
        </Transition>
      </div>
      <!-- <SnapShot :ticker="snapShotList[0]" /> -->
       <div class="snapshot-container-wrap" ref="snapShotContainerWrap">

         <SnapShot v-for="(lastQuote, index) in lastQuotes" :ticker="lastQuote.symbol" :quote="lastQuote.last" :aggregate="aggregates[index].results"/>
       </div>
      <RouterLink to="/register">
        <button class="start-btn">
          <span>Get Started</span>
        </button>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>

.home-view-container {
  position: relative;
  height: inherit;
  width: inherit;
  background-image: url("@/assets/img/6256458.jpg");
  background-position: center;
  background-size: cover
}

svg {
  display: block;
  height: inherit;
  width: inherit;
}

.header-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 5%;
  width: inherit;
  padding-left: 1dvw;
  padding-right: 1dvw; 
}

.user-icon {
  border-radius: 100%;
  height: 2rem;
  width: 2rem;
}

.user-icon:hover {
  background-color: lightgray;
}

.main-content-container {
  height: 95%;
  position: absolute;
  top: 5%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  row-gap: 3rem;
}

.title {
  width: 100vw;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  /* align-items: center;
  justify-content: center; */
  text-align: center;
}

.title span {
  text-shadow: 0.1rem 0.1rem 0.5rem deepskyblue;
  font-size: 2rem;
  font-weight: 600;
  white-space: nowrap;
}

.snapshot-container-wrap {
  width: 100vw;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
}

.start-btn {
  padding: 0.2rem 0.5rem 0.2rem 0.5rem;
  text-align: center;
  background: linear-gradient(to right, deepskyblue, skyblue, lightblue);
  background-size: 120% 120%;
  border-radius: 0.5rem;
  border: none;
  transition: all 0.3s;
}

.start-btn:hover {
  box-shadow: 0 0 0.5rem black;
  animation: linear-change 1s ease;
}

@keyframes linear-change {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 230% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.start-btn span {
  font-size: 1.2rem;
}

.fade-enter-active,
.fade-leave-active {
  transform: translateY(0);
  opacity: 1;
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10vh);
}

.fade2-enter-active,
.fade2-leave-active {
  transform: translateY(0);
  opacity: 1;
  transition: all 0.5s ease;
  transition-delay: 0.5s;
}

.fade2-enter-from,
.fade2-leave-to {
  opacity: 0;
  transform: translateY(10vh);
}

</style>
