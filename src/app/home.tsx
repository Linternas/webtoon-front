'use client';

import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import CalendarWebtoonItem from '@/components/webtoon/webtoonCardItem';

import { setComma } from '@/utils/number-format.utils';

import { CalendarWebtoon } from '@/types/webtoon';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@/styles/pages/home.scss';
import { sendGaEvent } from '@/utils/google-analytics';
import { fetchRecentlyPaidWebtoonList } from '@/api/webtoon';
import LoadingAnimation from '@/components/LoadingAnimation';

const settings = {
  customPaging: function () {
    return (
      <a>
        <div className="slider-bar">
          <div className="item"></div>
        </div>
      </a>
    );
  },
  dots: true,
  dotsClass: 'slick-dots slick-thumb',
  infinite: true,
  speed: 500,
  autoplaySpeed: 4000,
  slidesToShow: 1,
  slidesToScroll: 1,
  draggable: true,
};

interface toBePaidWebtoonsProps {
  toBePaidWebtoons: CalendarWebtoon[];
}

const HomePage = ({ toBePaidWebtoons }: toBePaidWebtoonsProps) => {
  const router = useRouter();

  const [isDragging, setIsDragging] = useState(false);
  const [isSliderClicking, setIsSliderClicking] = useState(false);
  const [sliderWebtoons, setSliderWebtoons] = useState<CalendarWebtoon[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data: recentlyPaidWebtoons = [],
    isFetching,
    isError,
    error,
  } = useQuery<CalendarWebtoon[], Error>({
    queryKey: ['recentlyPaidWebtoons'],
    queryFn: async () => await fetchRecentlyPaidWebtoonList({ page: currentPage }),
    retry: 1,
  });

  const onSliderDragStart = () => setIsDragging(true);
  const onSliderDragMoving = () => isSliderClicking && setIsDragging(true);
  const onSliderDragEnd = () => setIsDragging(false);

  const onClickSlider = (webtoonId: string) => {
    if (!isDragging) {
      router.push(`/${webtoonId}`);
    }
  };

  const setWebtoonToSlider = () => {
    if (toBePaidWebtoons.length > 0) {
      toBePaidWebtoons.forEach((webtoon, index) => {
        const nowDate = new Date();
        const toDate = webtoon.webtoon_data[0].paid_date;

        const diffDate = nowDate.getTime() - new Date(toDate).getTime();
        const dateDays = Math.round(diffDate / (1000 * 3600 * 24));

        if (dateDays === 0) {
          webtoon.diffDate = -1;
        } else {
          webtoon.diffDate = dateDays;
        }

        const paidDate = webtoon.webtoon_data[0].paid_date;
        const year = paidDate.substring(0, 4);
        const month = paidDate.substring(5, 7);
        const day = paidDate.substring(8, 10);

        webtoon.paidYear = year;
        webtoon.paidMonth = month;
        webtoon.paidDay = day;

        const cookiePrice = webtoon.webtoon_data[0].series_count * 200;
        webtoon.cookiePrice = cookiePrice;

        if (index > 0) {
          if (toBePaidWebtoons[index - 1].diffDate === webtoon.diffDate) {
            webtoon.isSameDiffDate = true;
          } else {
            webtoon.isSameDiffDate = false;
          }
        }
      });

      const _kakaoWebtoonList = toBePaidWebtoons.filter((x) => x.platform === 'KAKAO');
      const _naverWebtoonList = toBePaidWebtoons.filter((x) => x.platform === 'NAVER');

      let paidWebtoonList = [];

      let kakaoList = [];
      let naverList = [];

      for (const img of _kakaoWebtoonList) {
        if (kakaoList.length <= 0) {
          kakaoList.push(img);
        } else if (kakaoList[0].webtoon_data[0].paid_date === img.webtoon_data[0].paid_date) {
          kakaoList.push(img);
        }
      }

      for (const img of _naverWebtoonList) {
        if (naverList.length <= 0) {
          naverList.push(img);
        } else if (naverList[0].webtoon_data[0].paid_date === img.webtoon_data[0].paid_date) {
          naverList.push(img);
        }
      }

      paidWebtoonList = kakaoList.concat(naverList);

      paidWebtoonList = paidWebtoonList.sort(() => Math.random() - 0.5);
      paidWebtoonList = paidWebtoonList.splice(0, 3);

      for (const img of paidWebtoonList) {
        const _img1 = new Image();
        _img1.src = img.thumbnail_first_layer;

        const _img2 = new Image();
        _img2.src = img.thumbnail_second_layer;

        if (img.platform === 'NAVER') {
          img.widthDiff = (_img2.width - _img1.width) * -1 + 'px';
        }
      }

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

  return (
    <>
      <div className="home-container">
        <div className="slider-wrapper">
          {sliderWebtoons.length > 0 ? (
            <Slider {...settings}>
              {sliderWebtoons.map((webtoon, index) => (
                <div
                  onMouseDownCapture={onSliderDragStart}
                  onMouseMoveCapture={onSliderDragMoving}
                  onMouseUpCapture={onSliderDragEnd}
                  onClick={() => onClickSlider(String(webtoon.id))}
                  key={webtoon.id}
                  className="pointer">
                  <div style={{ background: webtoon.thumbnail_bg_color.split(':')[1] }} className="main-slider-wrapper">
                    <img className="img" src={webtoon.thumbnail_first_layer} />
                    <img className="img2" src={webtoon.thumbnail_second_layer} />

                    <div className="background_shadow"></div>

                    <div className="save_info">
                      {webtoon.diffDate > 0 ? <p className="text_price">최근 유료화 됐어요</p> : <p className="text_price">지금 보면 최대 {setComma(webtoon.cookiePrice)}원 절약!</p>}

                      {webtoon.diffDate === 0 && <p className="text_date">오늘 유료화 예정</p>}

                      <p className="text_date">
                        {webtoon.paidYear}년 {webtoon.paidMonth}월 {webtoon.paidDay}일 유료화
                      </p>
                    </div>

                    <div className="save_info"> </div>

                    <div className="webtoon_info">
                      {webtoon.platform === 'KAKAO' ? (
                        <>
                          <img src="/icons/K.svg" />
                        </>
                      ) : (
                        <>
                          <img src="/icons/N.svg" />
                        </>
                      )}

                      <p className="webtoon_title">{webtoon.title}</p>
                    </div>
                  </div>
                </div>
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
            }}>
            <div className="toggled nav-item">
              <p>유료화 일정</p>
            </div>
          </Link>

          <Link
            href="/genre"
            onClick={() => {
              sendGaEvent('웹툰투데이_장르별_보기');
            }}>
            <div className="normal nav-item">
              <p>장르별 보기</p>
            </div>
          </Link>
        </div>

        {toBePaidWebtoons.map((webtoon, index) => (
          <div className="fee-based-payment-wrapper" style={{ marginTop: !webtoon.isSameDiffDate ? '22px' : '0' }} key={index}>
            {webtoon.diffDate === 0 ? (
              <>{!webtoon.isSameDiffDate && <p className="title">오늘 유료화 예정</p>}</>
            ) : (
              <>{!webtoon.isSameDiffDate && <p className="title">{webtoon.diffDate * -1}일 뒤에 유료화</p>}</>
            )}

            <CalendarWebtoonItem {...webtoon} key={index} />
          </div>
        ))}

        <p className="webtoon-list-title">최근 유료화 된 작품</p>

        {recentlyPaidWebtoons.length > 0 ? (
          recentlyPaidWebtoons.map((webtoon, index) => (
            <div className="fee-based-payment-wrapper" key={index}>
              <CalendarWebtoonItem {...webtoon} key={index} />
            </div>
          ))
        ) : (
          <div className="flex justify-center mt-32">
            <p className="no-data">최근 유료화 된 작품이 없어요!</p>
          </div>
        )}

        <div className="bottom-action-wrapper">
          {!isError && !isFetching && recentlyPaidWebtoons.length > 0 && <img onClick={getNextPage} className="pointer" src="/icons/ic-more-btn.svg" />}
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
