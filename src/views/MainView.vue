<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { onMounted, onUnmounted, onBeforeMount, ref, reactive, computed, watch, provide } from 'vue';
import { useNavStore } from '@/stores/nav';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { useMarketStore } from '@/stores/market';
import { useSubscribeStore } from '@/stores/subscribe';
import { currentTransactionKey } from "@/utils/injectionKey";
import { getUserInfo } from "@/api/user";
import { stopSubscription, subscribe } from "@/api/subscription";
import { getCurrentTransaction } from "@/api/user";
import { useVuelidate } from '@vuelidate/core';
import { required, minValue, maxValue, integer, helpers } from '@vuelidate/validators';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import NavBar from '@/components/NavBar.vue';
import SubmitButton from '@/components/SubmitButton.vue';
import SubscribeDisabledInputField from '@/components/SubscribeDisabledInputField.vue';
import SubscribeInputField from '@/components/SubscribeInputField.vue';
import NotificationContainer from '@/components/NotificationContainer.vue';
import type INotification from '@/models/notification';
import type ITransaction from '@/models/transaction';

interface ISubscribeOrder {
    lot: number;
}

interface ILiveAccountData {
    equity: number;
    unrealizedPnL: number;
    currentTransaction: Array<ITransaction>;
}

let websocket: WebSocket | null = null;
const router = useRouter();
const navStore = useNavStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const marketStore = useMarketStore();
const subscribeStore = useSubscribeStore();
navStore.currentPath = "/main/account";
router.push("/main/account");

const liveAccountData: ILiveAccountData = reactive({equity: 0, unrealizedPnL: 0, currentTransaction: []});
const currentTransaction = ref<ITransaction[]>([]);
const formData: ISubscribeOrder = reactive({lot: 1});
const rules = computed(() => ({
  lot: {
    required: helpers.withMessage("This field is required", required),
    minValue: helpers.withMessage("At least 1 lot", minValue(1)),
    maxValue: helpers.withMessage("You don't have enough money", maxValue(userStore.maxLot)),
  }
}));
const v$ = useVuelidate(rules, formData);
const windowWidth = ref<number>(window.innerWidth);
const showNavBar = ref<boolean>(windowWidth.value > 1024);
const isRotate = ref<boolean>(false);
const isColorFade = ref<boolean>(false);
const notifications = ref<Array<INotification>>([]);
const mainContentContainer = ref<HTMLElement | null>(null);
const colorOfUserEquity = ref<string>("gray");
const colorOfUserUnrealizedPnL = ref<string>("gray");

provide(currentTransactionKey, currentTransaction);

onBeforeMount(async () => {
    if (authStore.token == "") {
        router.push("/login");
    }
    await loadData();
    
    if (marketStore.marketStatus?.currencies.fx == "open") {
        websocket = new WebSocket(import.meta.env.VITE_WEBSOCKET_BACKEND+"ws/user.trading.data", [authStore.token]);
        if (websocket != null) {
            websocket.addEventListener("message", (event)=>{
                let parseData: ILiveAccountData  = JSON.parse(event.data);
                liveAccountData.currentTransaction = parseData.currentTransaction;
                currentTransaction.value = parseData.currentTransaction;
                liveAccountData.equity = parseData.equity;
                liveAccountData.unrealizedPnL = parseData.unrealizedPnL;
                userStore.user!.equity = liveAccountData.equity;
                userStore.user!.unrealizedPnL = liveAccountData.unrealizedPnL;
            })
        }
    } 
})

onMounted(() => {
    window.addEventListener("resize", ()=>{
        windowWidth.value = window.innerWidth;
        if (mainContentContainer.value) {
            if (windowWidth.value > 1024 && showNavBar.value == true) {
                const navBarWidth = getComputedStyle(document.documentElement).getPropertyValue("--nav-bar-width");
                mainContentContainer.value.style.transform = `translateX(${navBarWidth})`;
                mainContentContainer.value.style.width = `calc(100dvw - ${navBarWidth})`;
            } else if (showNavBar.value == false || windowWidth.value <= 1024) {
                mainContentContainer.value.style.transform = "";
                mainContentContainer.value.style.width = "inherit";
            }
        }
    });
    if (mainContentContainer.value) {
        if (windowWidth.value > 1024 && showNavBar.value == true) {
            const navBarWidth = getComputedStyle(document.documentElement).getPropertyValue("--nav-bar-width");
            mainContentContainer.value.style.transform = `translateX(${navBarWidth})`;
            mainContentContainer.value.style.width = `calc(100dvw - ${navBarWidth})`;
        } else if (showNavBar.value == false || windowWidth.value <= 1024) {
            mainContentContainer.value.style.transform = "";
            mainContentContainer.value.style.width = "inherit";
        }
    }
})

onUnmounted(() => {
    window.removeEventListener("resize", ()=>{
        windowWidth.value = window.innerWidth;
        if (mainContentContainer.value) {
            if (windowWidth.value > 1024 && showNavBar.value == true) {
                const navBarWidth = getComputedStyle(document.documentElement).getPropertyValue("--nav-bar-width");
                mainContentContainer.value.style.transform = `translateX(${navBarWidth})`;
                mainContentContainer.value.style.width = `calc(100dvw - ${navBarWidth})`;
            } else if (showNavBar.value == false || windowWidth.value <= 1024) {
                mainContentContainer.value.style.transform = "";
                mainContentContainer.value.style.width = "inherit";
            }
        }
    })
    if (websocket != null) {
        websocket.close();
        websocket.removeEventListener("message", (event)=>{
            let parseData: ILiveAccountData  = JSON.parse(event.data);
            liveAccountData.currentTransaction = parseData.currentTransaction;
            currentTransaction.value = parseData.currentTransaction;
            liveAccountData.equity = parseData.equity;
            liveAccountData.unrealizedPnL = parseData.unrealizedPnL;
            userStore.user!.equity = liveAccountData.equity;
            userStore.user!.unrealizedPnL = liveAccountData.unrealizedPnL;
        });
    }
})


function addNotification(status: string, text: string) {
    notifications.value.push({status: status, text: text});
}

function onMenuIconClick() {
    isColorFade.value = true;
    setTimeout(()=> {
        isColorFade.value = false;
    }, 300);
    if (mainContentContainer.value && windowWidth.value > 1024) {
        const navBarWidth = getComputedStyle(document.documentElement).getPropertyValue("--nav-bar-width");
        mainContentContainer.value.style.transform = `translateX(${navBarWidth})`;
        mainContentContainer.value.style.width = `calc(100dvw - ${navBarWidth})`;
    }
    showNavBar.value = true; 
}

function closeModal() {
    subscribeStore.reset();
}

function closeMenu() {
    showNavBar.value = false;
    if (mainContentContainer.value && windowWidth.value > 1024) {
        mainContentContainer.value.style.transform = `translateX(0)`;
        mainContentContainer.value.style.width = `inherit`;
    }
}

function navigate(path: string) {
    closeMenu();
}


async function handleSubscribeSubmit() {
    try {
        const isValid = await v$.value.$validate();
        if (isValid == true) {
            const result = await subscribe(authStore.token, subscribeStore.ticker, formData.lot);
            if (result) {
                addNotification("Success", result.message);
                subscribeStore.showSubscribeModal = false;
                subscribeStore.ticker = "";
            }
        }
    } catch (error) {
        addNotification("Error", (error as any).response.data.message);
    }
}

async function handleStopSubscription() {
    try {
        try {
            const result = await stopSubscription(authStore.token, subscribeStore.ticker, subscribeStore.lot);
            if (result) {
                addNotification("Success", result.message);
                subscribeStore.reset();
                
            }
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        addNotification("Error", (error as any).response.data.message);
    }
}

async function loadData() {
    try {
        [userStore.user, currentTransaction.value] = await Promise.all([getUserInfo(authStore.token), getCurrentTransaction(authStore.token)]);
    } catch (error) {
        addNotification("Error", (error as any).response.data.message);
    }
}

watch(()=>userStore.user?.equity, (newValue, oldValue)=>{
    if (newValue && oldValue) {
        if (newValue > oldValue) {
            colorOfUserEquity.value = "green";
            setTimeout(()=>{
                colorOfUserEquity.value = "black";
            }, 1000)
        } else if (newValue < oldValue) {
            colorOfUserEquity.value = "red";
            setTimeout(()=>{
                colorOfUserEquity.value = "black";
            }, 1000)
        } else {
            colorOfUserEquity.value = "black";
        }
    }
})

watch(()=>userStore.user?.unrealizedPnL, (newValue, oldValue)=>{
    if (newValue && oldValue) {
        if (newValue > 0) {
            colorOfUserUnrealizedPnL.value = "green";
        } else if (newValue < 0) {
            colorOfUserUnrealizedPnL.value = "red";
        } else {
            colorOfUserUnrealizedPnL.value = "black";
        }
    }
})
</script>
<template>
    <div class="main-view-container">
        <NotificationContainer :notifications="notifications" :style="{'position': 'relative', 'z-index': 100000000}"/>
        <Transition name="fade">
            <NavBar v-if="showNavBar" :windowWidth="windowWidth"  @closeMenu="closeMenu" @navigate="navigate"/>
        </Transition>
        <div class="main-content-wrapper">
            <div class="dummy" v-if="showNavBar && windowWidth <= 1024" :class="{'colorFade': isColorFade}" @click="closeMenu"></div>
            <div class="dummy" v-if="subscribeStore.showSubscribeModal">
                <div class="modal">
                    <div class="close-icon-container" @click="closeModal">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                        </svg>
                    </div>
                    <form class="form" @submit.prevent="handleSubscribeSubmit">
                        <SubscribeDisabledInputField :type="'text'" :inputTitle="'Ticker'" :value="subscribeStore.ticker" :id="'Ticker'"/>
                        <SubscribeInputField 
                            :type="'number'"
                            :placeholder="''"
                            :autocomplete="'off'"
                            :errorExist="v$.lot.$error"
                            :id="'Lot'"
                            :inputTitle="'Lot'"
                            v-model="formData.lot"
                        />
                        <span v-if="v$.lot.required.$invalid">{{ v$.lot.required.$message }}</span>
                        <span v-if="v$.lot.minValue.$invalid">{{ v$.lot.minValue.$message }}</span>
                        <span v-if="v$.lot.maxValue.$invalid">{{ v$.lot.maxValue.$message }}</span>
                        <SubmitButton :value="'Submit'"/>
                    </form>
                </div>
            </div>
            <div class="dummy" v-if="subscribeStore.showStopSubscriptionModal">
                <div class="modal">
                    <div class="close-icon-container" @click="closeModal">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                        </svg>
                    </div>
                    <form class="form" @submit.prevent="handleStopSubscription">
                        <SubscribeDisabledInputField :type="'text'" :inputTitle="'Ticker'" :value="subscribeStore.ticker" :id="'Ticker'"/>
                        <SubscribeDisabledInputField :type="'text'" :inputTitle="'Lot'" :value="subscribeStore.lot.toString()" :id="'Lot'"/>
                        <SubscribeDisabledInputField :type="'text'" :inputTitle="'CreatedAt'" :value="subscribeStore.createdAt.toString()" :id="'CreatedAt'"/>
                        <div><span>Are you sure to stop the subscription?</span></div>
                        <div class="flex-center">
                            <SubmitButton :value="'Yes'"/>
                        </div>
                    </form>
                </div>
            </div>
            <div class="main-content-container" ref="mainContentContainer">
                <div class="header-container">
                    <div v-if="!showNavBar" :class="{'menu-icon-container': true, 'rotate': isRotate}" @click="onMenuIconClick">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
                        </svg>
                    </div>
                    <span class="title">DRL Trading Platform Demo</span>
                </div>
                <div class="section-container">
                    <RouterView v-slot="{ Component }">
                        <Suspense timeout="0">
                            <template #default>
                                <component :is="Component" @addNotification="addNotification"></component>
                            </template>
                            <template #fallback>
                                <LoadingSpinner/>
                            </template>
                        </Suspense>
                    </RouterView>
                </div>
                <div class="footer-container">
                    <div class="footer-col">
                        <div>Balance</div>
                        <div>${{ userStore.user?.balance }}</div>
                    </div>
                    <div class="footer-col">
                        <div>Equity</div>
                        <div :style="{color: colorOfUserEquity}">${{ userStore.user?.equity.toFixed(2) }}</div>
                    </div>
                    <div class="footer-col">
                        <div>Unrealized PnL</div>
                        <div :style="{color: colorOfUserUnrealizedPnL}">${{ userStore.user?.unrealizedPnL.toFixed(2) }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>

.main-view-container {
  position: relative;
  height: inherit;
  width: inherit;
}

.main-content-wrapper {
  height: inherit;
  width: inherit;
}

.main-content-wrapper .dummy {
    position: relative;
    /* display: flex;
    align-items: center;
    justify-content: center; */
    height: inherit;
    width: inherit;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 2;
}

.dummy .modal {
    padding: 0.5rem;
    position: absolute;
    top: calc((100% - 30rem) / 2);
    left: calc((100% - 23rem) / 2);
    height: 30rem;
    width: 23rem;
    background-color: white;
    border-radius: 0.5rem;
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
}

.close-icon-container {
    height: 2rem;
    width: 2rem;
}

.close-icon-container svg {
  display: block;
  height: inherit;
  width: inherit;
}

.main-content-wrapper .main-content-container {
    position: absolute;
    top: 0;
    height: inherit;
    width: inherit;
    z-index: 1;
    transition: all 0.3s ease;
}

.main-content-wrapper .main-content-container .header-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 5%;
    padding: 0.5rem;
}

.main-content-wrapper .main-content-container .header-container .title {
    font-size: 1.5rem;
    font-weight: bolder;
}


.main-content-wrapper .main-content-container .section-container {
    background-color: ghostwhite;
    height: 87%;
}

.main-content-wrapper .main-content-container .footer-container {
    height: 8%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0rem -0.3rem 1.2rem -0.45rem gray;
}

.footer-col {
    text-align: center;
    font-size: 1rem;
}

.main-content-wrapper .main-content-container button {
    position: absolute;
    right: 0;
}

.menu-icon-container {
  height: 2rem;
  width: 2rem;
}

.menu-icon-container svg {
  display: block;
  height: inherit;
  width: inherit;
}

.flex-center {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.flex-center input {
    margin: 0;
    width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transform: translateX(0);
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateX(-15rem);
}

.colorFade {
    animation: colorFade 0.3s ease;
}

.rotate {
    animation: rotate 0.3s ease;
}

@keyframes colorFade {
    0% {
        background-color: transparent;
    }
    100% {
        background-color: rgba(0, 0, 0, 0.2);
    }
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

/* @media not all and (max-width: 1024px) {
    .header-container, .section-container, .footer-container {
        transform: translateX(var(--nav-bar-width));
        width: calc(100dvw - var(--nav-bar-width));
    }

    .dummy .modal {
        top: calc((100% - 30rem) / 2);
        left: calc((100% - 20rem + var(--nav-bar-width)) / 2);
    }
} */
</style>