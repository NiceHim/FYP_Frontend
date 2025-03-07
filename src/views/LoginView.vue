<script setup lang="ts">
import { computed, ref, reactive } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { useAuthStore } from '@/stores/auth';
import { login } from '@/api/auth';
import NotificationContainer from '@/components/NotificationContainer.vue';
import InputField from '@/components/InputField.vue';
import SubmitButton from '@/components/SubmitButton.vue';
import type INotification from "@/models/notification";


interface FormData {
  userName: string,
  password: string
}

const router = useRouter();
const authStore = useAuthStore();
const form = ref<HTMLFormElement>();
const formData = reactive<FormData>({userName: "", password: ""});
const notificaitions = ref<Array<INotification>>([]);
  
const rules = computed(() => ({
  userName: {
    required: helpers.withMessage("This field is required", required)
  },
  password: {
    required: helpers.withMessage("This field is required", required),
  }
}))

const v$ = useVuelidate(rules, formData);

async function handleSubmit(event: any) {
  try {
    const valid = await v$.value.$validate();
    if (valid) {
      const result = await login(formData.userName, formData.password);
      if (result.message == "Successfully login") {
        router.push("/main");
      }
    }
  } catch (error) {
    console.log((error as any).response.data.message);
    notificaitions.value.push({status: "Error", text: (error as any).response.data.message});
  }
}
</script>

<template>
    <div class="login-view-container">
        <div class="header-container">
          <RouterLink to="/">
            <div class="home-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
              </svg>
            </div>
          </RouterLink>
        </div>
        <NotificationContainer :notifications="notificaitions"/>
        <div class="main-content-container">
          <div class="login-card-container">
            <span>Login</span>
            <form class="form" @submit.prevent="handleSubmit">
              <InputField
                :type="'text'"
                :placeholder="'Name'"
                :autocomplete="'off'"
                :errorExist="v$.userName.$error"
                :id="'name'"
                :inputTitle="'Name'"
                v-model="formData.userName"
              />
              <span v-if="v$.userName.required.$invalid">{{ v$.userName.required.$message }}</span>
              <InputField
                :type="'password'"
                :placeholder="'Password'"
                :autocomplete="'off'"
                :errorExist="v$.password.$error"
                :id="'password'"
                :inputTitle="'Password'"
                v-model="formData.password"
              />
              <span v-if="v$.password.required.$invalid">{{ v$.password.required.$message }}</span>
              <SubmitButton :value="'Login'" />
            </form>
            <div class="register-text-conatainer">
              <span>Don't have an account? </span>
              <RouterLink to="/register">
                <span class="register-span">Register</span>
              </RouterLink>
            </div>
          </div>
        </div>
    </div>
</template>

<style scoped>
svg {
  display: block;
  height: inherit;
  width: inherit;
}

.login-view-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: inherit;
  width: inherit;
  background-image: url("@/assets/img/6256458.jpg");
  background-position: center;
  background-size: cover
}   

.login-view-container .header-container {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  top: 0;
  height: 5%;
  width: 100%;
  padding-left: 1dvw;
  padding-right: 1dvw;
}

.home-icon {
  border-radius: 100%;
  height: 2rem;
  width: 2rem;
}

.home-icon:hover {
  background-color: lightgray;
}

.login-view-container .main-content-container {
  height: 95%;
  width: 100%;
  position: absolute;
  top: 5%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
}

.login-card-container {
  background: linear-gradient(45deg, deepskyblue, skyblue, lightblue);
  padding: 0.5rem;
  height: 40rem;
  width: 20rem;
  border-radius: 0.5rem;
  box-shadow: 0rem 0rem 2rem darkgray;
}

.login-card-container {
  text-align: center;
}

.login-card-container span {
  font-size: 2rem;
  font-weight: 600;
}

.form {
  display: flex;
  flex-direction: column;
  text-align: left;
  font-size: 1.2rem;
  row-gap: 0.5rem;
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

.form input[type="submit"] {
  border: none;
  border-radius: 0.5rem;
  height: 2rem;
  font-size: 1rem;
  background-color: lime;
  margin-top: 1rem;
  padding: 0 0.5rem 0 0.5rem;
  transition: all 0.3s;
}

.form input[type="submit"]:hover {
  box-shadow: 0rem 0rem 0.5rem black;
  /* background: linear-gradient(to right, deepskyblue, skyblue, lightblue);
  background-size: 120% 120%;
  animation: linear-change 1s ease; */
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
.register-text-conatainer {
  margin-top: 0.5rem;
}

.register-text-conatainer span {
  font-size: 1rem;
}

.register-span:hover {
  color: red;
}
</style>