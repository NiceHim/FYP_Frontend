import type IAreaChartData from '@/models/areaChartData';
import type ITransaction from '@/models/transaction';
import type { InjectionKey, Ref } from 'vue';

export const areaChartDataKey = Symbol() as InjectionKey<any>;
export const currentTransactionKey = Symbol() as InjectionKey<Ref<Array<ITransaction>>>;
