import base from "@/api/base";
import type IUser from "@/models/user";
import type IBalanceRecord from "@/models/balanceRecord";

export async function getUserInfo(token: string): Promise<IUser> {
    const { data } = await base.post("/user/userInfo", {}, {
        headers: {
            "Authorization" : `token ${token}`
        }
    });
    return data;
}

export async function getBalanceRecord(token: string): Promise<Array<IBalanceRecord>> {
    const { data } = await base.post("/user/balanceRecord", {}, {
        headers: {
            "Authorization" : `token ${token}`
        }
    });
    return data;
}

export async function deposit(token: string, depositAmt: number) {
    const params = {
        depositAmt: depositAmt
    };
    const { data } = await base.post("/user/deposit", params, {
        headers: {
            "Authorization" : `token ${token}`
        }
    });
    return data;
}

export async function withdraw(token: string, withdrawAmt: number) {
    const params = {
        withdrawAmt: withdrawAmt
    };
    const { data } = await base.post("/user/withdraw", params, {
        headers: {
            "Authorization" : `token ${token}`
        }
    });
    return data;
}

export async function getSubscription(token: string) {
    const { data } = await base.post("/user/subscription", {}, {
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
    const { data } = await base.post("/user/subscribe", params, {
        headers: {
            "Authorization" : `token ${token}`
        }
    });
    return data;
}

export async function getCurrentTransaction(token: string) {
    const { data } = await base.post("/user/currentTransaction", {}, {
        headers: {
            "Authorization" : `token ${token}`
        }
    });
    return data;
}