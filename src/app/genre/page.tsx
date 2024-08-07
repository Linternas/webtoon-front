'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { BottomSheet } from 'react-spring-bottom-sheet';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { fetchWebtoonList, ICalendarWebtoonResponse } from '@/api/webtoon';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserve';

import 'react-spring-bottom-sheet/dist/style.css';
import '@/styles/pages/search-genre.scss';
import Select from '@/components/Select';
import LoadingAnimation from '@/components/LoadingAnimation';

interface Filters {
  title: String;
  value: String;
  isChecked: boolean;
}

const categories = [
  { text: '전체', value: 'all' },
  { text: '판타지', value: 'fantasy' },
  { text: '로맨스', value: 'pure' },
  { text: '액션/무협', value: 'action' },
  { text: '드라마', value: 'drama' },
  { text: '공포/스릴러', value: 'thrill' },
  { text: '일상/개그', value: 'daily' },
];

const customStyles = {
  menu: (base: any) => ({
    ...base,
    fontFamily: 'Pretendard',
    fontSize: '13px',
    color: '#2C3131',
    zIndex: 100,
  }),

  control: (provided: any, state: any) => ({
    ...provided,
    background: '#fff',
    fontFamily: 'Pretendard',
    fontSize: '13px',
    color: '#2C3131',
    minHeight: '30px',
    height: '30px',
    boxShadow: state.isFocused ? null : null,
    border: 'none',
    zIndex: 1,
    cursor: 'pointer',
  }),

  valueContainer: (provided: any, state: any) => ({
    ...provided,
    height: '30px',
    padding: '0 6px',
    fontFamily: 'Pretendard',
    fontSize: '13px',
    zIndex: 0,
  }),

  input: (provided: any, state: any) => ({
    ...provided,
    margin: '0px',
    fontFamily: 'Pretendard',
    zIndex: 0,
  }),

  indicatorSeparator: (state: any) => ({
    display: 'none',
    zIndex: 0,
  }),

  indicatorsContainer: (provided: any, state: any) => ({
    ...provided,
    height: '30px',
    fontSize: '13px',
    zIndex: 0,
  }),
};

const WebtoonGenrePage = () => {
  const queryClient = useQueryClient();

  const [currentGenre, setCurrentGenre] = useState<string>('all');
  const [currentOrder, setCurrentOrder] = useState('recent');
  const [currentPage, setCurrentPage] = useState(0);
  const [options, setOptions] = useState([
    { value: 'recent', label: '최신순' },
    { value: 'old', label: '오래된순' },
    { value: 'money', label: '절약금액순' },
    { value: 'like', label: '좋아요순' },
  ]);
  const [filters, setFilters] = useState<Array<Filters>>([
    { title: '네이버 웹툰', value: 'naver', isChecked: false },
    { title: '카카오 웹툰', value: 'kakao', isChecked: false },
    { title: '연재작품', value: 'updating', isChecked: false },
    { title: '완결작품', value: 'completed', isChecked: false },
  ]);
  const [isFilterBottomSheetOpen, setIsFilterBottomSheetOpen] = useState(false);
  const [totalWebtoonCount, setTotalWebtoonCount] = useState(0);

  const queryKey = useMemo(() => ['webtoonList', currentGenre, currentOrder, filters, currentPage], [currentGenre, currentOrder, filters, currentPage]);

  const {
    data: webtoonList,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
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
    enabled: true,
  });

  const { setTarget } = useIntersectionObserver({
    hasNextPage,
    fetchNextPage,
  });

  const handleClickFilter = (index: number) => {
    const copyArray = [...filters];
    copyArray[index].isChecked = !copyArray[index].isChecked;
    setFilters(copyArray);
  };

  const sendGa = (text: string) => {
    window.gtag('event', text, { send_to: 'G-RBTEKD8D4E' });
  };

  const setSessionStorage = () => {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

    const sessionObj = {
      data: webtoonList,
      scroll: scrollPosition,
      currentOrder,
      currentGenre,
      filters,
      totalCount: 0,
    };

    window.sessionStorage.setItem('webtoonlist', JSON.stringify(sessionObj));
  };

  const handleChangeOrder = (e: any) => {
    setCurrentOrder(e.value);
  };

  const restoreSessionStorage = useCallback(() => {
    const savedData = window.sessionStorage.getItem('searchwebtoonlist');
    if (savedData) {
      const sessionData = JSON.parse(savedData);
      setCurrentOrder(sessionData.currentOrder);
      setCurrentGenre(sessionData.currentGenre);
      setFilters(sessionData.filters);
      setTotalWebtoonCount(sessionData.totalCount);
      setCurrentPage(sessionData.currentPage);
      queryClient.setQueryData<InfiniteData<ICalendarWebtoonResponse>>(queryKey, sessionData.data);
    }
  }, [queryClient, queryKey]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      restoreSessionStorage();
    }
  }, [restoreSessionStorage]);

  return (
    <div className="main-genre-container">
      <div className="genre-nav-toggle-wrapper">
        <Link
          href="/"
          onClick={() => {
            sendGa('웹툰투데이_유료화_일정');
          }}>
          <div className="nav-item normal">
            <p>유료화 일정</p>
          </div>
        </Link>

        <Link
          href="/genre"
          onClick={() => {
            sendGa('웹툰투데이_장르별_보기');
          }}>
          <div className="nav-item toggled">
            <p>장르별 보기</p>
          </div>
        </Link>
      </div>

      <div className="genre-page-wrapper">
        <div className="flex align-center genre-chip-wrapper" >
          {categories.map((category, index) => (
            <div onClick={() => setCurrentGenre(category.value)} className={`genre-category-chip ${currentGenre === category.value ? 'selected' : ''}`} key={index}>
              <p>{category.text}</p>
            </div>
          ))}
        </div>

        <div className="divider" />

        <div className="category-filter-container">
          <Select onChange={handleChangeOrder} options={options} styles={customStyles} currentValue={currentOrder} />
          <Image src="/icons/ic_filter.svg" className="pointer" onClick={() => setIsFilterBottomSheetOpen(true)} alt="Filter" width="20" height="30" />
        </div>

        <div className="search-genre-webtoon-container">
          {webtoonList?.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.results.map((webtoon) => (
                <Link href={`/webtoon/${webtoon.id}`} key={webtoon.id} onClick={setSessionStorage}>
                  <div className="pointer genre-webtoon-card" style={{ backgroundColor: webtoon.thumbnail_bg_color?.split(':')[1]! }}>
                    <div>
                      <Image className="background-gradient" src="/images/gradient.png" alt="gradient" width="328" height="180" />
                      <img className="background" src={webtoon.thumbnail_first_layer} alt={webtoon.title} />
                      {webtoon.thumbnail_second_layer && <img className="background2" src={webtoon.thumbnail_second_layer} alt={webtoon.title} />}
                    </div>
                    <Image className="img-platform" src={`/icons/ic-${webtoon.platform.toLowerCase()}-w.svg`} alt={webtoon.platform} width="12" height="12" />
                    <p className="title">
                      {webtoon.is_censored && <Image src="/icons/ic-censored.svg" alt="Censored" width="12" height="12" />}
                      {webtoon.title}
                    </p>
                    <p className="writer">{webtoon.author}</p>
                  </div>
                </Link>
              ))}
            </React.Fragment>
          ))}

          {isLoading && (
            <div className="flex justify-center mb-16">
              <LoadingAnimation type="bubbles" color="#000" />
            </div>
          )}
          <div ref={setTarget}></div>
        </div>

        <BottomSheet
          open={isFilterBottomSheetOpen}
          onDismiss={() => setIsFilterBottomSheetOpen(false)}
          className="bottom-sheet"
          snapPoints={({ minHeight }) => minHeight}>
          {filters.map((item, index) => (
            <div onClick={() => handleClickFilter(index)} key={index} className="bottom_sheet_item">
              <p>{item.title}</p>
              <Image src={item.isChecked ? '/icons/ic_check.svg' : '/icons/ic_checked.svg'} alt="Check" width="22" height="24" />
            </div>
          ))}
        </BottomSheet>
      </div>
    </div>
  );
};

export default WebtoonGenrePage;
