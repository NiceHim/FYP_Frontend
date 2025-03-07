import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useUserStore } from './user';
import type IUserTradingData from '@/models/userTradingData';
import type ITransaction from '@/models/transaction';

export const useTradingDataWebSocketStore = defineStore(
    "tradingDataWebSocket",
    () => {
        const userStore = useUserStore();
        let isDisconnectCalled = false;
        let websocket: WebSocket | null = null;
        let serverTimeoutId: NodeJS.Timeout | null = null;
        const currentTransaction = ref<ITransaction[]>([]);

        function connect() {
            websocket = new WebSocket(import.meta.env.VITE_WEBSOCKET_BACKEND+"ws/user.trading.data");
            websocket.onmessage = (event) => {
                if (event.data === "ping") {
                    setServerTimeout();
                    websocket!.send("pong");
                } else {
                    const data: IUserTradingData = JSON.parse(event.data);
                    currentTransaction.value = data.currentTransaction;
                    userStore.user!.equity = data.equity;
                    userStore.user!.unrealizedPnL = data.unrealizedPnL;
                }
            }

            websocket.onerror = (event) => {
                reconnect();
            }
            
            websocket.onclose = (event) => {
                if (isDisconnectCalled == false) {
                    reconnect();
                }
            }
        }

        function setServerTimeout() {
            if (serverTimeoutId != null) clearTimeout(serverTimeoutId);
            serverTimeoutId = setTimeout(()=>{
                websocket!.close();
            }, 20000)
        }

        function reconnect() {
            setTimeout(() => {
                connect();
            }, 2000)
        }

        function disconnect() {
            if (websocket != null) {
                isDisconnectCalled = true;
                websocket.close();
            }
        }

        return { currentTransaction, connect, disconnect };
    }
)