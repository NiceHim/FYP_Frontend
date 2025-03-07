import base from "@/api/base";

export async function getCurrentSubscription() {
    const { data } = await base.get("/subscription/current");
    return data;
}

export async function getHistorySubscription() {
    const { data } = await base.get("/subscription/history");
    return data;
}


export async function subscribe(ticker: string, lot: number) {
    const params = {
        ticker: ticker,
        lot: lot
    };
    const { data } = await base.post("/subscription/subscribe", params);
    return data;
}

export async function updateSubscription(ticker: string, params: object) {
    const { data } = await base.patch(`/subscription/${ticker}`, params);
    return data;
}