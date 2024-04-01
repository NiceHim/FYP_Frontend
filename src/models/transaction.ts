export default interface ITransaction {
    ticker: string;
    price: number;
    lot: number;
    action: string;
    PnL: number;
    createdAt: Date;
    endedAt: Date;
}