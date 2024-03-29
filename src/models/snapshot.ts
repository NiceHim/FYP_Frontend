export default interface ISnapShot {
    ticker: string;
    todaysChange: number;
    todaysChangePerc: number;
    updated: number;
    day: {
        o: number;
        h: number;
        l: number;
        c: number;
        v: number;
        vw: number;
    }
    lastQuote: {
        a: number;
        b: number;
        t: number;
        x: number;
    }
    min: {
        t: number;
        n: number;
        o: number;
        h: number;
        l: number;
        c: number;
        v: number;
        vw: number;
    }
    prevDay: {
        o: number;
        h: number;
        l: number;
        c: number;
        v: number;
        vw: number;
    }
}