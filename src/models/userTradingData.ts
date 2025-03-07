import type ITransaction from "./transaction";

export default interface IUserTradingData {
    equity: number;
    unrealizedPnL: number;
    currentTransaction: Array<ITransaction>;
}