import { EventEmitter } from "events";
import WebSocket from "ws";

class WebSocketClient extends EventEmitter {
    ws: WebSocket | null;
    connected: boolean;

    constructor(address: string) {
        super();
        this.ws = null;
        this.connected = false;
        this.connect(address);
    }

	connect(address: string) {
		this.ws = new WebSocket(address);
		// this.ws.on('open', this.onOpen.bind(this));
		this.ws.on('close', this.onDisconnect.bind(this));
		this.ws.on('disconnect', this.onDisconnect.bind(this));
		this.ws.on('error', this.onError.bind( this ));
		this.ws.on('message', this.onMessage.bind(this));
	}

	// onOpen() {
	// 	// Authenticate:
    //     if (this.ws) {
    //         this.ws.send(`{"action":"auth","params":"${APIKEY}"}`);
    //     }
	// 	this.connected = true;
	// 	// Subscribe to Crypto Trades and SIP:
	// 	this.sendSubscriptions(this.subscriptions);
	// }

	// sendSubscriptions(subscriptions: any[]) {
    //     if (this.ws) {
    //         this.ws.send(`{"action":"subscribe","params":"${subscriptions.join(',')}"}`);
    //     }
	// }

	onDisconnect() {
		setTimeout(this.connect.bind(this), 1000);
	}

	onError(e: any) {
		console.log('Error:', e);
	}

	onMessage(data: any) {
		data = JSON.parse(data);
		data.forEach((msg: any) => {
			this.emit("message", msg);
		})
	}
}

export function getForexQuoteDataSocket() {
    const queryString = "/ws/forex.quote.data/";
    // return new WebSocketClient(import.meta.env.VITE_WEBSOCKET_BACKEND+queryString);
	return new WebSocket(import.meta.env.VITE_WEBSOCKET_BACKEND+queryString);
}

export function getUserTradingDataSocket(token: string): WebSocket {
    const queryString = "/ws/user.trading.data/";
    // return new WebSocketClient(import.meta.env.VITE_WEBSOCKET_BACKEND+queryString);
	return new WebSocket(import.meta.env.VITE_WEBSOCKET_BACKEND+queryString, [token]);
}