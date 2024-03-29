interface ISubscription {
    ticker: string;
    lot: number;
    status: "running" | "ended";
    doneAt?: Date;
    createdAt: Date;
}

export interface ICurrentSubscription extends ISubscription {
    status: "running";
}

export interface IHistorySubscription extends ISubscription {
    status: "ended";
    doneAt?: Date;
}