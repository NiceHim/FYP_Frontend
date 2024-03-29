export interface IQuote {
    a: number;
    b: number;
    t: number;
}

export interface IDetailedQuote extends IQuote {
    ev: string;
    p: string;
    i: number;
    a: number;
    b: number;
    x: number;
    t: number;
}

export interface ILastQuote {
    ask: number;
    bid: number;
    exchange: string;
    timestamp: number;
}
