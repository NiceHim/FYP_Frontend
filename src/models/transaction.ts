export default interface ITransaction {
    ticker: string;
    price: number;
    lot: number;
    action: string;
    PnL: number;
    done: boolean;
    createdAt: Date;
    endedAt: Date;
}