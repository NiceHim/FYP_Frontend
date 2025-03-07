import base from "@/api/base";
import type IUser from "@/models/user";
import type IBalanceRecord from "@/models/balanceRecord";

export async function getUserInfo(): Promise<IUser> {
    const { data } = await base.get("/user/info");
    return data;
}

export async function getBalanceRecord(): Promise<Array<IBalanceRecord>> {
    const { data } = await base.get("/user/balance-records");
    return data;
}

export async function deposit(depositAmt: number) {
    const params = {
        depositAmt: depositAmt
    };
    const { data } = await base.post("/user/deposit", params);
    return data;
}

export async function withdraw(withdrawAmt: number) {
    const params = {
        withdrawAmt: withdrawAmt
    };
    const { data } = await base.post("/user/withdraw", params);
    return data;
}

// export async function getTransaction(done: boolean) {
//     const queryParams = new URLSearchParams({done: done.toString()});
//     const pathString = "/user/transactions/?" + queryParams.toString();
//     const { data } = await base.get(pathString);
//     return data;
// }

export async function getCurrentTransaction() {
    const { data } = await base.get("/user/current-transactions");
    return data;
}

export async function getHistoryTransaction() {
    const { data } = await base.get("/user/history-transactions");
    return data;
}