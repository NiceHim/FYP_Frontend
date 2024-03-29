import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type IUser from "@/models/user";

export const useUserStore = defineStore(
  "user", 
  () => {
    const user = ref<IUser>();
    const maxLot = computed(()=>{
      return user.value == null ? 0 : Math.floor(user.value.balance / 100000);
    });
    return { user, maxLot };
  }, 
  {
    persist: {
      storage: sessionStorage,
    },
  }
)
