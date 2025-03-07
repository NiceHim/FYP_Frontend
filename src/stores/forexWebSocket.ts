import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import type { IDetailedQuote } from '@/models/quote';

export const useForexWebSocketStore = defineStore(
    "forexWebSocket",
    () => {
        let isDisconnectCalled = false;
        let websocket: WebSocket | null = null;
        let serverTimeoutId: NodeJS.Timeout | null = null;
        const state = reactive({
            forexMap: new Map()
        });

        function setForexMap(key: string, value: IDetailedQuote) {
            state.forexMap.set(key, value);
        }

        function connect() {
            websocket = new WebSocket(import.meta.env.VITE_WEBSOCKET_BACKEND+"ws/forex.quote.data");
            websocket.onmessage = (event) => {
                if (event.data === "ping") {
                    setServerTimeout();
                    websocket!.send("pong");
                } else {
                    const data: IDetailedQuote = JSON.parse(event.data);
                    setForexMap(data.p, data);
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
                state.forexMap.clear();
            }
        }

        return { state, connect, disconnect };
    }
)