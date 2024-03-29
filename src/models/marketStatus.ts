export default interface IMarketStatus {
    afterHours: boolean;
    currencies: {
        crypto: string;
        fx: string;
    };
    earlyHours: boolean;
    exchanges: {
        nasdaq: string;
        nyse: string;
        otc: string;
    };
    indicesGroups: {
        s_and_p: string;
        societe_generale: string;
        msci: string;
        ftse_russell: string;
        mstar: string;
        mstarc: string;
        cccy: string;
        nasdaq: string;
        dow_jones: string;
    };
    market: string;
    serverTime: string
}