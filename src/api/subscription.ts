import base from "@/api/base";

export async function getCurrentSubscription(token: string) {
    const { data } = await base.post("/subscription/currentSubscription", {}, {
        headers: {
            "Authorization" : `token ${token}`
        }
    });
    return data;
}

export async function getHistorySubscription(token: string) {
    const { data } = await base.post("/subscription/historySubscription", {}, {
        headers: {
            "Authorization" : `token ${token}`
        }
    });
    return data;
}


export async function subscribe(token: string, ticker: string, lot: number) {
    const params = {
        ticker: ticker,
        lot: lot
    };
    const { data } = await base.post("/subscription/subscribe", params, {
        headers: {
            "Authorization" : `token ${token}`
        }
    });
    return data;
}

export async function stopSubscription(token: string, ticker: string, lot: number) {
    const params = {
        ticker: ticker,
        lot: lot
    };
    const { data } = await base.post("/subscription/stopSubscription", params, {
        headers: {
            "Authorization" : `token ${token}`
        }
    });
    return data;
}