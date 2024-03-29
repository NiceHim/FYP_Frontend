import base from "@/api/base";
import type ISnapShot from "@/models/snapshot";
import type IMarketStatus from "@/models/marketStatus";
import type IAggregate from "@/models/aggregate";
import { type ILastQuote } from "@/models/quote";

export async function getSnapShotTickers(tickers: string): Promise<Array<ISnapShot>> {
    const queryString = "/market/snapshot/" + tickers;
    const { data } = await base.get(queryString);
    return data;
}


export async function getAggregateData(ticker: string, multiplier: number, timespan: string, from: string, to: string, adjusted: "true" | "false" = "true", sort: "asc" | "desc" = "asc"): Promise<Array<IAggregate>> {
    const queryParams = new URLSearchParams({
        ticker: ticker,
        multiplier: multiplier.toString(),
        timespan: timespan,
        from: from,
        to: to,
        adjusted: adjusted,
        sort: sort
    });
    const queryString = "/market/aggregate/?";
    const { data } = await base.get(queryString+queryParams.toString());
    return data;
}

export async function getMarketStatus(): Promise<IMarketStatus> {
    const queryString = "/market/status/";
    const { data } = await base.get(queryString);
    return data;
}

export async function getLastQuote(firstTicker: string, secondTicker: string): Promise<ILastQuote> {
    const queryParams = new URLSearchParams({
        firstTicker: firstTicker,
        secondTicker: secondTicker
    });
    const queryString = "/market/lastQuote/?";
    const { data } = await base.get(queryString+queryParams.toString());
    return data;
}

export async function getLastQuoteAndAggregate(ticker: string, multiplier: number, timespan: string, from: string, to: string, adjusted: "true" | "false" = "true", sort: "asc" | "desc" = "asc"): Promise<any> {
    const queryParams = new URLSearchParams({
        ticker: ticker,
        multiplier: multiplier.toString(),
        timespan: timespan,
        from: from,
        to: to,
        adjusted: adjusted,
        sort: sort
    });
    const queryString = "/market/lastQuoteAndAggregate/?";
    const { data } = await base.get(queryString+queryParams.toString());
    return data;
}