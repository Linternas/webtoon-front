'use client';

import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import { CalendarWebtoon } from '@/types/webtoon';
import { sendGaEvent } from '@/utils/google-analytics';
import { fetchRecentlyPaidWebtoonList } from '@/api/webtoon';
import { sliderSettings } from '@/utils/slick-settings';

import LoadingAnimation from '@/components/LoadingAnimation';
import SliderWebtoonItem from './components/SliderWebtoonItem';
import CalendarWebtoonItem from '@/components/webtoon/webtoonCardItem';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@/styles/pages/home.scss';

const processWebtoons = (toBePaidWebtoons: CalendarWebtoon[]) => {
  return toBePaidWebtoons.map((webtoon, index) => {
    const nowDate = new Date().getTime();
    const toDate = new Date(webtoon.webtoon_data[0].paid_date).getTime();

    const diffDate = Math.round((nowDate - toDate) / (1000 * 3600 * 24));

    webtoon.diffDate = diffDate === 0 ? -1 : diffDate;

    const [year, month, day] = webtoon.webtoon_data[0].paid_date.split('-');
    webtoon.paidYear = year;
    webtoon.paidMonth = month;
    webtoon.paidDay = day;

    webtoon.cookiePrice = webtoon.webtoon_data[0].series_count * 200;

    return webtoon;
  });
};

const groupWebtoonsByPaidDate = (webtoons: CalendarWebtoon[]) => {
  return webtoons.reduce<Record<string, CalendarWebtoon[]>>((acc, webtoon) => {
    const paidDate = webtoon.webtoon_data[0].paid_date;
    if (!acc[paidDate]) {
      acc[paidDate] = [];
    }
    acc[paidDate].push(webtoon);
    return acc;
  }, {});
};

interface toBePaidWebtoonsProps {
  toBePaidWebtoons: CalendarWebtoon[];
}

const HomePage = ({ toBePaidWebtoons }: toBePaidWebtoonsProps) => {
  const [sliderWebtoons, setSliderWebtoons] = useState<CalendarWebtoon[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data: recentlyPaidWebtoons = [],
    isFetching,
    isError,
    error
  } = useQuery<CalendarWebtoon[], Error>({
    queryKey: ['recentlyPaidWebtoons'],
    queryFn: async () => await fetchRecentlyPaidWebtoonList({ page: currentPage }),
    retry: 1
  });

  const setWebtoonToSlider = () => {
    if (toBePaidWebtoons.length > 0) {
      const processedWebtoons = processWebtoons(toBePaidWebtoons);

      const _kakaoWebtoonList = processedWebtoons.filter((x) => x.platform === 'KAKAO');
      const _naverWebtoonList = processedWebtoons.filter((x) => x.platform === 'NAVER');

      let paidWebtoonList = [];

      const groupWebtoonsByDate = (webtoonList: CalendarWebtoon[]) => {
        return webtoonList.reduce<Record<string, CalendarWebtoon[]>>((acc, webtoon) => {
          const date = webtoon.webtoon_data[0].paid_date;
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(webtoon);
          return acc;
        }, {});
      };

      const kakaoWebtoonsByDate = groupWebtoonsByDate(_kakaoWebtoonList);
      const naverWebtoonsByDate = groupWebtoonsByDate(_naverWebtoonList);

      paidWebtoonList = [...Object.values(kakaoWebtoonsByDate).flat(), ...Object.values(naverWebtoonsByDate).flat()];
      paidWebtoonList = paidWebtoonList.sort(() => Math.random() - 0.5).splice(0, 3);

      paidWebtoonList.forEach((img) => {
        const _img1 = new Image();
        _img1.src = img.thumbnail_first_layer;

        const _img2 = new Image();
        _img2.src = img.thumbnail_second_layer;

        if (img.platform === 'NAVER') {
          img.widthDiff = (_img2.width - _img1.width) * -1 + 'px';
        }
      });

      setSliderWebtoons(paidWebtoonList);
    }
  };

  const getNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    if (toBePaidWebtoons.length > 0) {
      setWebtoonToSlider();
    }
  }, [toBePaidWebtoons]);

  const groupedWebtoons = groupWebtoonsByPaidDate(toBePaidWebtoons);

  return (
    <>
      <div className="home-container">
        <div className="slider-wrapper">
          {sliderWebtoons.length > 0 ? (
            <Slider {...sliderSettings}>
              {sliderWebtoons.map((webtoon) => (
                <SliderWebtoonItem {...webtoon} key={webtoon.id} />
              ))}
            </Slider>
          ) : (
            <div className="main-slider-empty">
              <p>유료화 일정인 웹툰이 없어요!</p>
              <img src="/icons/ic-slider-empty.svg" alt="slider-empty" width="151" height="139" />
            </div>
          )}
        </div>

        <div className="nav-toggle-wrapper">
          <Link
            href="/"
            onClick={() => {
              sendGaEvent('웹툰투데이_유료화_일정');
            }}
          >
            <div className="toggled nav-item">
              <p>유료화 일정</p>
            </div>
          </Link>

          <Link
            href="/genre"
            onClick={() => {
              sendGaEvent('웹툰투데이_장르별_보기');
            }}
          >
            <div className="normal nav-item">
              <p>장르별 보기</p>
            </div>
          </Link>
        </div>

        {Object.entries(groupedWebtoons).map(([paidDate, webtoons], index) => {
          const isToday = new Date(paidDate).toDateString() === new Date().toDateString();

          return (
            <div className="fee-based-payment-wrapper" style={{ marginTop: '22px' }} key={paidDate}>
              <p className="title">{isToday ? '오늘 유료화 예정' : `${webtoons[0].diffDate * -1}일 뒤에 유료화`}</p>
              {webtoons.map((webtoon) => (
                <CalendarWebtoonItem {...webtoon} key={webtoon.id} />
              ))}
            </div>
          );
        })}

        <p className="webtoon-list-title">최근 유료화 된 작품</p>

        {recentlyPaidWebtoons.length > 0 ? (
          recentlyPaidWebtoons.map((webtoon, index) => (
            <div key={index}>
              <CalendarWebtoonItem {...webtoon} />
            </div>
          ))
        ) : (
          <div className="flex justify-center mt-32">
            <p className="no-data">최근 유료화 된 작품이 없어요!</p>
          </div>
        )}

        <div className="bottom-action-wrapper">
          {!isError && !isFetching && recentlyPaidWebtoons.length > 0 && (
            <img onClick={getNextPage} className="pointer" src="/icons/ic-more-btn.svg" />
          )}
          {isError && (
            <div className="flex justify-center">
              <p className="no-data">에러가 발생했습니다: {error.message}</p>
            </div>
          )}
          {isFetching && (
            <div className="flex justify-center">
              <LoadingAnimation type="bubbles" color="#000" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
