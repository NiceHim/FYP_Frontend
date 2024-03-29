import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useSubscribeStore = defineStore(
  "subscribe", 
  () => {
    const showSubscribeModal = ref<boolean>(false);
    const showStopSubscriptionModal = ref<boolean>(false);
    const ticker = ref<string>("");
    const lot = ref<number>(1);
    const createdAt = ref<Date>(new Date());

    function reset() {
      showSubscribeModal.value = false;
      showStopSubscriptionModal.value = false;
      ticker.value = "";
      lot.value = 1
      createdAt.value = new Date();
    }

    return { showSubscribeModal, showStopSubscriptionModal, ticker, lot, createdAt, reset };
  }, 
  {
    persist: {
      storage: sessionStorage,
    },
  }
)
