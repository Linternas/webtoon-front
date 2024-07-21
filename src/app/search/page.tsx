'use client';

import { useRouter } from 'next/navigation';
import { fetchWebtoonList } from '@/api/webtoon';
import React, { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';

import thumbnailWebtoon from '@/assets/json/webtoon.json';

import '@/styles/pages/search.scss';
import { CalendarWebtoon } from '@/types/webtoon';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import LoadingAnimation from '@/components/LoadingAnimation';

type TWebtoonThumbnail = {
  [prop: string]: any;
};

type WebtoonCategoryKey = 'all' | 'daily' | 'fantasy' | 'action' | 'pure' | 'drama' | 'thrill';

const _thumbnailWebtoon: TWebtoonThumbnail = thumbnailWebtoon;

const webtoonCategoryKorean: Record<WebtoonCategoryKey, string> = {
  all: '전체',
  daily: '일상',
  fantasy: '판타지',
  action: '액션',
  pure: '로맨스',
  drama: '드라마',
  thrill: '공포&스릴러',
};

const Search = () => {
  const router = useRouter();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [thumbnails, setThumbnails] = useState<TWebtoonThumbnail>({
    all: {},
    daily: {},
    fantasy: {},
    action: {},
    pure: {},
    drama: {},
    thrill: {},
  });

  const searchSetTime = useRef<NodeJS.Timeout | null>(null);

  const handleClickRouteBack = () => {
    router.back();
  };

  const { data: webtoonList = [], refetch } = useQuery<CalendarWebtoon[]>({
    queryKey: ['webtoonList', searchKeyword],
    queryFn: async () => {
      if (searchKeyword.trim() === '') return [];
      const param = { search: searchKeyword };
      const data = await fetchWebtoonList(param);
      return data.results;
    },
    enabled: false, // 비활성화된 상태로 시작
  });

  const onChangeSearchKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyboard = e.target.value;

    setSearchKeyword(keyboard);
    setIsSearching(true);

    if (searchSetTime.current) {
      clearTimeout(searchSetTime.current);
    }

    searchSetTime.current = setTimeout(() => {
      setIsSearching(false);
      refetch();
    }, 800);
  };

  const sendGa = (text: string) => {
    window.gtag('event', text, { send_to: 'G-RBTEKD8D4E' });
  };

  useLayoutEffect(() => {
    const genreKeys: any = Object.keys(thumbnailWebtoon);
    const tempGenre: TWebtoonThumbnail = {};

    genreKeys.forEach((key: string) => {
      let isOverlaped = false;
      let isWhile = true;

      while (isWhile) {
        const random = _thumbnailWebtoon[key].sort(() => Math.random() - 0.5).splice(0, 1);

        isOverlaped = Object.keys(tempGenre).some((genreKey) => tempGenre[genreKey][0]?.id === random[0]?.id);

        if (!isOverlaped) {
          tempGenre[key] = random;
          isWhile = false;
        }
      }
    });

    setThumbnails(tempGenre);
  }, []);

  return (
    <div className="search_container">
      <div className="search-content">
        <div className="header">
          <Image onClick={handleClickRouteBack} src="/icons/ic_search_arrow_back.svg" alt="ArrowBack" width={24} height={24} />
        </div>

        <p className="search_top_text">
          어떤 웹툰을
          <br />
          찾으시나요?
        </p>

        <div className="search_bar">
          <input onChange={onChangeSearchKeyword} placeholder="웹툰명을 검색해주세요." />
        </div>
      </div>

      <div className="search-spacer" />

      {isSearching ? (
        <div className="flex justify-center">
          <LoadingAnimation type="bubbles" color="#000" />
          <div className="height-500"></div>
        </div>
      ) : (
        <>
          {webtoonList.length > 0 && searchKeyword !== ''
            ? webtoonList.map((webtoon, index) => (
                <Link href={`/${webtoon.id}`} key={webtoon.id}>
                  <div className="serached-item">
                    <Image src="/icons/ic-search-gray.svg" alt="Search" width={24} height={24} />
                    <p>{webtoon.title}</p>
                  </div>
                </Link>
              ))
            : thumbnails.all.length > 0 &&
              (searchKeyword === '' ? (
                <div className="genre-container">
                  <div className="webtoon-genre-layout">
                    {Object.keys(thumbnails).map((key) => (
                      <div key={key}>
                        <Link href={`/search/${key}`} onClick={() => sendGa(`검색_${key}`)}>
                          <div className={`webtoon-item bg-item-${key}`} style={{ backgroundColor: thumbnails[key][0].thumbnail_bg_color }}>
                            <div className="bg-gradient"></div>
                            <img src={`${thumbnails[key][0].thumbnail_first_layer}`} alt="ThumbnailFristLayer" />
                            <img src={`${thumbnails[key][0].thumbnail_second_layer}`} alt="ThumbnailSecondLayer" />
                            <p>{webtoonCategoryKorean[key as WebtoonCategoryKey]}</p>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="empty-list">
                  <p>검색결과가 없습니다.</p>
                </div>
              ))}
        </>
      )}
    </div>
  );
};

export default Search;
