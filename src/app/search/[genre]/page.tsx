'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchWebtoonList, ICalendarWebtoonResponse } from '@/api/webtoon';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserve';
import { setComma } from '@/utils/number-format.utils';
import { BottomSheet } from 'react-spring-bottom-sheet';
import Link from 'next/link';

import 'react-spring-bottom-sheet/dist/style.css';
import '@/styles/pages/search-genre.scss';
import Image from 'next/image';
import LoadingAnimation from '@/components/LoadingAnimation';

interface Filters {
  title: string;
  value: string;
  isChecked: boolean;
}

const categories: { [key: string]: string } = {
  all: '전체',
  fantasy: '판타지',
  pure: '로맨스',
  action: '액션/무협',
  drama: '드라마',
  thrill: '공포/스릴러',
  daily: '일상/개그',
};

const SearchGenrePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [currentGenre, setCurrentGenre] = useState<string>('all');
  const [currentOrder, setCurrentOrder] = useState('asc');
  const [filters, setFilters] = useState<Array<Filters>>([
    { title: '네이버 웹툰', value: 'naver', isChecked: false },
    { title: '카카오 웹툰', value: 'kakao', isChecked: false },
    { title: '연재작품', value: 'updating', isChecked: false },
    { title: '완결작품', value: 'completed', isChecked: false },
  ]);
  const [totalWebtoonCount, setTotalWebtoonCount] = useState(0);
  const [isFilterBottomSheetOpen, setIsFilterBottomSheetOpen] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const queryKey = useMemo(() => ['webtoonList', currentGenre, currentOrder, filters], [currentGenre, currentOrder, filters]);

  const {
    data: webtoonList,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery<ICalendarWebtoonResponse, Error>({
    queryKey,
    queryFn: async () => {
      const params = {
        genre: currentGenre,
        order: currentOrder,
        filter: filters
          .filter((f) => f.isChecked)
          .map((f) => f.value)
          .toString(),
        page: currentPage + 1,
      };

      const data = await fetchWebtoonList(params);
      setTotalWebtoonCount(data.count);
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= Math.ceil(lastPage.count / 20) ? nextPage : undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    enabled: shouldFetch,
  });

  const { setTarget } = useIntersectionObserver({
    hasNextPage,
    fetchNextPage,
  });

  const handleClickRouteBack = () => {
    router.back();
  };

  const handleClickFilter = (index: number) => {
    const filtersCopy = [...filters];
    filtersCopy[index].isChecked = !filtersCopy[index].isChecked;
    setFilters(filtersCopy);
  };

  const openBottomSheet = () => {
    setIsFilterBottomSheetOpen(true);
  };

  const onDismissBottomSheet = () => {
    setIsFilterBottomSheetOpen(false);
  };

  const setSessionStorage = () => {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

    const sessionObj = {
      data: webtoonList,
      scroll: scrollPosition,
      selectedOrder: currentOrder,
      selectedCategory: currentGenre,
      filters: filters,
      totalCount: totalWebtoonCount,
      currentPage: currentPage,
    };

    window.sessionStorage.setItem('searchwebtoonlist', JSON.stringify(sessionObj));
  };

  const restoreSessionStorage = useCallback(() => {
    const savedData = window.sessionStorage.getItem('searchwebtoonlist');
    if (savedData) {
      const sessionData = JSON.parse(savedData);
      setCurrentOrder(sessionData.selectedOrder);
      setCurrentGenre(sessionData.selectedCategory);
      setFilters(sessionData.filters);
      setTotalWebtoonCount(sessionData.totalCount);
      setCurrentPage(sessionData.currentPage);
      queryClient.setQueryData<InfiniteData<ICalendarWebtoonResponse>>(queryKey, sessionData.data);
      setShouldFetch(false);
    }
  }, [queryClient, queryKey]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      restoreSessionStorage();
    }
  }, [restoreSessionStorage]);

  return (
    <>
      <div className="search-genre-container">
        <div className="toolbar">
          <Image onClick={handleClickRouteBack} src="/icons/ic_search_arrow_back.svg" alt="Back" width={24} height={24} />
        </div>

        <div className="title-content">
          <div className="flex align-end">
            <p className="title">{categories[currentGenre]}</p>
            <span className="count">{setComma(totalWebtoonCount)}개</span>
          </div>

          <Image src="/icons/ic_filter.svg" onClick={openBottomSheet} alt="Filter" width={20} height={20} />
        </div>
      </div>

      <div className="search-genre-webtoon-container">
        {webtoonList?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.results.map((webtoon) => (
              <Link href={`/webtoon/${webtoon.id}`} key={webtoon.id} onClick={setSessionStorage}>
                <div className="webtoon-card pointer" style={{ backgroundColor: webtoon.thumbnail_bg_color?.split(':')[1]! }}>
                  <img className="background" src={webtoon.thumbnail_first_layer} alt={webtoon.title} />
                  {webtoon.thumbnail_second_layer && <img className="background2" src={webtoon.thumbnail_second_layer} alt={webtoon.title} />}
                  <Image className="img-platform" src={`/icons/ic-${webtoon.platform.toLowerCase()}-w.svg`} alt={webtoon.platform} width="12" height="12" />
                  <p className="title">{webtoon.title}</p>
                  <p className="writer">{webtoon.author}</p>
                </div>
              </Link>
            ))}
          </React.Fragment>
        ))}

        {isFetching && (
          <div className="flex justify-center mb-16">
            <LoadingAnimation type="bubbles" color="#000" />
          </div>
        )}
        <div ref={setTarget}></div>
      </div>

      <BottomSheet open={isFilterBottomSheetOpen} onDismiss={onDismissBottomSheet} className="bottom-sheet" snapPoints={({ minHeight }) => minHeight}>
        {filters.map((item, index) => (
          <div onClick={() => handleClickFilter(index)} key={index} className="bottom_sheet_item">
            <p>{item.title}</p>
            <Image src={item.isChecked ? '/icons/ic_check.svg' : '/icons/ic_checked.svg'} alt="Check" width="22" height="24" />
          </div>
        ))}
      </BottomSheet>
    </>
  );
};

export default SearchGenrePage;
