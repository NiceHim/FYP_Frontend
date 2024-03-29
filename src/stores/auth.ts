import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import router from '@/router';

export const useAuthStore = defineStore(
  "auth", 
  () => {
    const token = ref<string>("");
    function logout() {
      token.value = "";
      router.push("/login");
    }
    return { token, logout };
  }, 
  {
    persist: {
      storage: sessionStorage,
    },
  }
)
