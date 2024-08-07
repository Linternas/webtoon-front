import { fetchToBePaidWebtoonList } from '@/api/webtoon';
import HomePage from './home/home';

const fetchTobePaidWebtoosBySSR = async () => {
  const response = await fetchToBePaidWebtoonList();
  return response;
};

export default async function MainPage() {
  // SSR로 데이터 fetch
  const webtoons = await fetchTobePaidWebtoosBySSR();
  return <HomePage toBePaidWebtoons={webtoons} />;
}
