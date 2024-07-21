import { CalendarWebtoon } from '@/types/webtoon';
import { setComma } from '@/utils/number-format.utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SliderWebtoonItem = (webtoon: CalendarWebtoon) => {
  const router = useRouter();

  const [isDragging, setIsDragging] = useState(false);
  const [isSliderClicking, setIsSliderClicking] = useState(false);

  const onSliderDragStart = () => setIsDragging(true);
  const onSliderDragMoving = () => isSliderClicking && setIsDragging(true);
  const onSliderDragEnd = () => setIsDragging(false);

  const onClickSlider = (webtoonId: string) => {
    if (!isDragging) {
      router.push(`/webtoon/${webtoonId}`);
    }
  };

  return (
    <div
      onMouseDownCapture={onSliderDragStart}
      onMouseMoveCapture={onSliderDragMoving}
      onMouseUpCapture={onSliderDragEnd}
      onClick={() => onClickSlider(String(webtoon.id))}
      key={webtoon.id}
      className="pointer"
    >
      <div style={{ background: webtoon.thumbnail_bg_color.split(':')[1] }} className="main-slider-wrapper">
        <img className="img" src={webtoon.thumbnail_first_layer} />
        <img className="img2" src={webtoon.thumbnail_second_layer} />

        <div className="background_shadow"></div>

        <div className="save_info">
          {webtoon.diffDate > 0 ? (
            <p className="text_price">최근 유료화 됐어요</p>
          ) : (
            <p className="text_price">지금 보면 최대 {setComma(webtoon.cookiePrice)}원 절약!</p>
          )}

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
  );
};

export default SliderWebtoonItem;
