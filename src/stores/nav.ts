import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import router from '@/router';

export const useNavStore = defineStore(
  "nav", 
  () => {
    const currentPath = ref<string>("");
    return { currentPath };
  }, 
  {
    persist: {
      storage: sessionStorage,
    },
  }
)
