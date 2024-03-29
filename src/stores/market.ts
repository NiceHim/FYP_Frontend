import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type MarketStatus from '@/models/marketStatus'

export const useMarketStore = defineStore(
  'market', 
  () => {
    const marketStatus = ref<MarketStatus>();
    return { marketStatus }
  },
  {
    persist: {
        storage: sessionStorage,
      },
  }
)
