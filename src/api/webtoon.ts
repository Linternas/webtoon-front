import { CalendarWebtoon } from '@/types/webtoon';
import { fetcher } from '@/api/fetcher';

export interface ICalendarWebtoonResponse {
  count: number;
  results: CalendarWebtoon[];
}

export const fetchWebtoonList = async (params: any): Promise<ICalendarWebtoonResponse> => {
  try {
    const url = `/list?${new URLSearchParams(params).toString()}`;
    const data = await fetcher<{ data: ICalendarWebtoonResponse }>(url);
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const fetchToBePaidWebtoonList = async (): Promise<CalendarWebtoon[]> => {
  try {
    const url = '/list/to-be-paid';
    const data = await fetcher<{ data: { results: CalendarWebtoon[] } }>(url);
    return data.data.results;
  } catch (error) {
    throw error;
  }
};

export const fetchRecentlyPaidWebtoonList = async (params: any): Promise<CalendarWebtoon[]> => {
  try {
    const url = `/list/recently-paid?${new URLSearchParams(params).toString()}`;
    const data = await fetcher<{ data: { results: CalendarWebtoon[] } }>(url);
    return data.data.results;
  } catch (error) {
    throw error;
  }
};

export const fetchWebtoonDetail = async (webtoonId: string): Promise<CalendarWebtoon> => {
  try {
    const url = `/list/${webtoonId.toString()}`;
    const data = await fetcher<CalendarWebtoon>(url);
    return data;
  } catch (error) {
    throw error;
  }
};
