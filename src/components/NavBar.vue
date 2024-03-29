<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useNavStore } from '@/stores/nav';
import { useUserStore } from '@/stores/user';


const navStore = useNavStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const props = defineProps({
    windowWidth: {type: Number, required: true},
})
const emits = defineEmits(["closeMenu", "navigate"]);

function onMenuCloseIconClick() {
    emits("closeMenu");
}

function onNavListClick(path: string) {
    navStore.currentPath = path;
    emits("navigate", path);
}
</script>

<template>
    <div class="nav-bar-container">
        <div class="menu-close-icon-wrapper">
            <div class="menu-close-icon-container" @click="onMenuCloseIconClick">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                    <path d="M120-240v-80h520v80H120Zm664-40L584-480l200-200 56 56-144 144 144 144-56 56ZM120-440v-80h400v80H120Zm0-200v-80h520v80H120Z"/>
                </svg>
            </div>
        </div>
        <div class="user-name-container">
            <span>{{ userStore.user?.userName }}</span>
        </div>
        <div class="list-container">
            <ul>
                <RouterLink to="/main/account" style="text-decoration: none; color: inherit;">
                    <li @click="onNavListClick('/main/account')" :class="{'selected': navStore.currentPath == '/main/account'}">
                        <div class="list-icon-container">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/>
                            </svg>
                        </div>
                        <h1>Account</h1>
                    </li>
                </RouterLink>
                <RouterLink to="/main/deposit" style="text-decoration: none; color: inherit;">
                    <li @click="onNavListClick('/main/deposit')" :class="{'selected': navStore.currentPath == '/main/deposit'}">
                        <div class="list-icon-container">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                <path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z"/>
                            </svg>
                        </div>
                        <h1>Deposit</h1>
                    </li>
                </RouterLink>
                <RouterLink to="/main/withdraw" style="text-decoration: none; color: inherit;">
                    <li @click="onNavListClick('/main/withdraw')" :class="{'selected': navStore.currentPath == '/main/withdraw'}">
                        <div class="list-icon-container">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                <path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z"/>
                            </svg>
                        </div>
                        <h1>Withdraw</h1>
                    </li>
                </RouterLink>
                <RouterLink to="/main/trade" style="text-decoration: none; color: inherit;">
                    <li @click="onNavListClick('/main/trade')" :class="{'selected': navStore.currentPath == '/main/trade'}">
                        <div class="list-icon-container">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                <path d="M280-160v-80h-80v-480h80v-80h80v80h80v480h-80v80h-80Zm0-160h80v-320h-80v320Zm320 160v-200h-80v-280h80v-160h80v160h80v280h-80v200h-80Zm0-280h80v-120h-80v120Zm-280-40Zm320-20Z"/>
                            </svg>
                        </div>
                        <h1>Trade</h1>
                    </li>
                </RouterLink>
                <RouterLink to="/main/positions" style="text-decoration: none; color: inherit;">
                    <li @click="onNavListClick('/main/positions')" :class="{'selected': navStore.currentPath == '/main/positions'}">
                        <div class="list-icon-container">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                <path d="M240-80q-50 0-85-35t-35-85v-120h120v-560l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v680q0 50-35 85t-85 35H240Zm480-80q17 0 28.5-11.5T760-200v-560H320v440h360v120q0 17 11.5 28.5T720-160ZM360-600v-80h240v80H360Zm0 120v-80h240v80H360Zm320-120q-17 0-28.5-11.5T640-640q0-17 11.5-28.5T680-680q17 0 28.5 11.5T720-640q0 17-11.5 28.5T680-600Zm0 120q-17 0-28.5-11.5T640-520q0-17 11.5-28.5T680-560q17 0 28.5 11.5T720-520q0 17-11.5 28.5T680-480ZM240-160h360v-80H200v40q0 17 11.5 28.5T240-160Zm-40 0v-80 80Z"/>
                            </svg>    
                        </div>
                        <h1>Positions</h1>
                    </li>
                </RouterLink>
                <li @click="authStore.logout()">
                    <div class="list-icon-container">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
                        </svg>
                    </div>
                    <h1>Logout</h1>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.nav-bar-container {
    position: absolute;
    background: linear-gradient(45deg, deepskyblue, skyblue, lightblue);
    top: 0;
    height: 100dvh;
    width: var(--nav-bar-width);
    z-index: 100000000000;
}

.nav-bar-container .user-name-container {
    text-align: center;
    margin-top: 2rem;
}

.nav-bar-container .user-name-container span {
    font-size: 2rem;
    font-weight: 600;
}

.nav-bar-container .list-container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    margin-top: 2rem;
}

.nav-bar-container .list-container ul {
    text-align: center;
    display: flex;
    flex-direction: column;
    row-gap: 1.5rem;
}

.nav-bar-container .list-container ul li {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-radius: 0.5rem;
    height: 2.5rem;
}

.nav-bar-container .list-container ul li h1 {
    font-size: 1.3rem;
    font-weight: 600;
}

.nav-bar-container ul li:hover h1 {
    color: dodgerblue;
}

.nav-bar-container .list-container ul li:hover svg {
    fill: dodgerblue;
}

.menu-close-icon-wrapper {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 5%;
    padding: 0.5rem;
}

.menu-close-icon-container {
  height: 2rem;
  width: 2rem;
}

.list-icon-container {
    height: 2rem;
    width: 2rem;
}

svg {
    display: block;
    height: inherit;
    width: inherit;
}


.selected {
    background-color: white;
    color: dodgerblue;
    fill: dodgerblue;
}
</style>