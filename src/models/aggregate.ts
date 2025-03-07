import type IAreaChartData from '@/models/areaChartData';

export interface IAggregate {
    c: number;
    h: number,
    l: number,
    n: number,
    o: number,
    t: number,
    v: number,
    vw: number
}

export interface IRequestAggregate {
    adjusted: boolean;
    queryCount: number;
    request_id: string;
    results: IAggregate;
    resultsCount: number;
    status: string;
    ticker: string;
}

export interface IReducedAggregate {
    results: Array<IAreaChartData>;
    symbol: string;
}