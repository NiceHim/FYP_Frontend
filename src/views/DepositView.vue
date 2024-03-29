<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, numeric, minValue, helpers } from '@vuelidate/validators';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import { useNavStore } from '@/stores/nav';
import { deposit, getUserInfo } from '@/api/user';
import SubmitButton from '@/components/SubmitButton.vue';
import InputField from '@/components/InputField.vue';

interface Deposit {
  depositAmount: number
}


const emits = defineEmits(["addNotification"]);
const navStore = useNavStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const formData = reactive<Deposit>({"depositAmount": 0});

const rules = computed(() => ({
  depositAmount: {
    required: helpers.withMessage("This field is required", required),
    numeric: helpers.withMessage("Must be number", numeric),
    minValue: helpers.withMessage("At least $1", minValue(1))
  }
}));

const v$ = useVuelidate(rules, formData);

function onNavBtnClick(path: string) {
  navStore.currentPath = path;
}

async function handleSubmit(event: any) {
  try {
    const valid = await v$.value.$validate();
    if (valid == true) {
      const result = await deposit(authStore.token, formData.depositAmount);
      console.log(result);
      formData.depositAmount = 0;
      const user = await getUserInfo(authStore.token);
      userStore.user = user;
      emits("addNotification", "Success", result.message);
    }
  } catch (error) {
    console.log((error as any).response.data.message);
    emits("addNotification", "Error", (error as any).response.data.message);
    // errorTexts.value.push((error as any).response.data.message);
  }
}

</script>
<template>
    <div class="deposit-view-container">
        <div class="btns-container">
          <RouterLink to="/main/deposit">
            <button class="btn" 
              :disabled="navStore.currentPath == '/main/deposit'" 
              :style="{backgroundColor: navStore.currentPath == '/main/deposit' ? 'deepskyblue' : 'white'}" 
              @click="onNavBtnClick('/main/deposit')"
            >
              <span>Deposit</span>
            </button>
          </RouterLink>
          <RouterLink to="/main/withdraw">
            <button class="btn" 
              :disabled="navStore.currentPath == '/main/withdraw'" 
              :style="{backgroundColor: navStore.currentPath == '/main/withdraw' ? 'deepskyblue' : 'white'}"
              @click="onNavBtnClick('/main/withdraw')"
            >
              <span>Withdraw</span>
            </button>
          </RouterLink>
        </div>
        <div class="account-info-container">
          <span>Account: {{ userStore.user?.userName }}</span>
          <span>Balance: $ {{ userStore.user?.balance }}</span>
        </div>
        <div class="form-container">
          <form class="form" @submit.prevent="handleSubmit">
              <InputField
                :type="'text'"
                :placeholder="'Amount to deposit'"
                :autocomplete="'off'"
                :errorExist="v$.depositAmount.$error"
                :id="'deposit'"
                :inputTitle="'Deposit'"
                v-model="formData.depositAmount"
              />
              <span v-if="v$.depositAmount.required.$invalid">{{ v$.depositAmount.required.$message }}</span>
              <span v-if="v$.depositAmount.numeric.$invalid">{{ v$.depositAmount.numeric.$message }}</span>
              <span v-if="v$.depositAmount.minValue.$invalid">{{ v$.depositAmount.minValue.$message }}</span>
              <SubmitButton :value="'Submit'"/>
          </form>
        </div>
    </div>
</template>
<style scoped>
.btn {
  border: none;
  border-radius: 0.5rem;
  padding: 0.2rem;
  box-shadow: 0 0 0.5rem lightgray;
  transition: all 0.3s;
}

.btn:hover {
  box-shadow: 0 0 0.5rem black;
}

.btn span {
  font-size: 1.5rem;
}

.deposit-view-container {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  height: inherit;
  width: inherit;
  padding: 1rem;
}

.deposit-view-container .btns-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  column-gap: 0.5rem;
}

.deposit-view-container span {
  font-size: 1.2rem;
}

.deposit-view-container .form-container {
  padding: 1rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 0 0.5rem lightgray;
}
.deposit-view-container .account-info-container {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  padding: 1rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 0 0.5rem lightgray;
}

.form {
  display: flex;
  flex-direction: column;
  text-align: left;
  font-size: 1.2rem;
  row-gap: 0.5rem;
  /* margin-top: 1rem; */
}

.form span {
  font-size: 1rem;
  color: red;
}

.form input[type="text"], .form input[type="password"] {
  border: 0.15rem solid #ccc;
  outline: none;
  transition: 0.1s;
  height: 2rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  padding: 0 0.5rem 0 0.5rem;
}

.form input[type="text"]:focus, .form input[type="password"]:focus {
  border: 0.15rem solid #555;
}

@media (min-width: 1024px) {
  .deposit-view-container .form-container, .deposit-view-container .account-info-container {
    width: 20rem;
  }

  /* form input {
    width: 10rem;
  } */
}
</style>@/stores/user@/api/user@/api/user