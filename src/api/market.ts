import base from "@/api/base";
import type ISnapShot from "@/models/snapshot";
import type IMarketStatus from "@/models/marketStatus";
import { type IAggregate, type IReducedAggregate } from "@/models/aggregate";
import { type ILastQuote, type IReducedLastQuote } from "@/models/quote";

export async function getSnapShotTickers(tickers: string): Promise<Array<ISnapShot>> {
    const pathString = "/market/snapshot/" + tickers;
    const { data } = await base.get(pathString);
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
    const pathString = "/market/aggregate/?" + queryParams.toString();
    const { data } = await base.get(pathString);
    return data;
}

export async function getMarketStatus(): Promise<IMarketStatus> {
    const pathString = "/market/status/";
    const { data } = await base.get(pathString);
    return data;
}

export async function getLastQuote(firstTicker: string, secondTicker: string): Promise<ILastQuote> {
    const queryParams = new URLSearchParams({
        firstTicker: firstTicker,
        secondTicker: secondTicker
    });
    const pathString = "/market/last-quote/?" + queryParams.toString();
    const { data } = await base.get(pathString);
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
    const pathString = "/market/last-quote-and-aggregate/?" + queryParams.toString();
    const { data } = await base.get(pathString);
    return data;
}

export async function getAllLastQuotes(): Promise<Array<IReducedLastQuote>> {
    const pathString = "/market/all-last-quotes/";
    const { data } = await base.get(pathString);
    return data;
}

export async function getAllAggregates(multiplier: number, timespan: string, from: string, to: string, adjusted: "true" | "false" = "true", sort: "asc" | "desc" = "asc"): Promise<Array<IReducedAggregate>> {
    const queryParams = new URLSearchParams({
        multiplier: multiplier.toString(),
        timespan: timespan,
        from: from,
        to: to,
        adjusted: adjusted,
        sort: sort
    });
    const pathString = "/market/all-aggregates/?" + queryParams.toString();
    const { data } = await base.get(pathString);
    return data;
}