/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';

// import _getWebtoonDetail from '@/api/webtoonId';
import { useEffect, useRef, useState } from 'react';
import { setComma } from '@/utils/number-format.utils';
import { shareToFacebook, shareToKakao, shareToTwitter } from '@/utils/sns-share.utils';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { fetchWebtoonDetail } from '@/api/webtoon';

import '@/styles/pages/webtoon-detail.scss';
import { CalendarWebtoon } from '@/types/webtoon';
import Image from 'next/image';

interface RouteParams {
  params: {
    webtoonId: string;
  };
}

const WebtoonDetail = ({ params }: RouteParams) => {
  const router = useRouter();
  const webtoonId = params.webtoonId;
  const [saveMoney, setSaveMoney] = useState(0);
  const [diffDate, setDiffDate] = useState(0);
  const [isShowDesc, setIsShowDesc] = useState(false);
  const [isShareModal, setIsShareModal] = useState(false);
  const outSection = useRef<HTMLDivElement>(null);

  const { data: webtoonData, isLoading } = useQuery<CalendarWebtoon>({
    queryKey: ['webtoonDetailById', webtoonId],
    queryFn: () => fetchWebtoonDetail(webtoonId),
    enabled: !!webtoonId,
  });

  const closeModal = () => setIsShareModal(false);
  const showDesc = () => setIsShowDesc(true);

  const handleClickShare = (platform: 'facebook' | 'twitter' | 'kakao') => {
    const url = `https://todaytoon.me/${webtoonId}`;
    const title = webtoonData?.webtoon_data[0]?.paid_date && diffDate < 0 ? `오늘 보면 ${setComma(saveMoney)}원 아낄 수 있는 웹툰 알려드림` : `이 웹툰 재질 걍 미쳤음 꼭 보세요`;

    if (platform === 'facebook') {
      shareToFacebook();
    } else if (platform === 'twitter') {
      shareToTwitter(title, url);
    } else if (platform === 'kakao') {
      shareToKakao(`이 웹툰, 오늘 봐야 ${setComma(saveMoney)}원 아낄 수 있어요!`, '#웹툰투데이 #웹툰정주행 #오늘까지_무료', 'https://ifh.cc/g/6FyVQj.png', url);
    }
  };

  const handleShareUrl = () => {
    const url = `https://todaytoon.me/${webtoonId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast('클립보드에 복사되었습니다.', {
        position: 'bottom-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
  };

  useEffect(() => {
    if (webtoonData) {
      const seriesCount = webtoonData.webtoon_data[0].series_count;
      setSaveMoney(seriesCount * 100);

      const nowDate = new Date();
      const toDate = new Date(webtoonData.webtoon_data[0].paid_date);
      const dateDays = Math.round((nowDate.getTime() - toDate.getTime()) / (1000 * 3600 * 24));

      setDiffDate(dateDays);
    }
  }, [webtoonData]);

  return webtoonData ? (
    <div className="webtoon-detail-container">
      <title>{webtoonData.title}</title>

      <div className="thumbnail-wrapper">
        <div onClick={() => router.back()}>
          <img src="/icons/ic_left_arrow.svg" alt="arrow" className="pointer" width={12} height={20} />
        </div>
        <div className="webtoon-name">
          {webtoonData.is_censored && <Image className="mr-8" src="/icons/ic-censored.svg" alt="Censored" width="12" height="12" />}
          {webtoonData.title}
        </div>
        <div>
          <img onClick={() => setIsShareModal(true)} className="pointer" src="/icons/ic_share.svg" alt="arrow" width={24} height={24} />
        </div>
      </div>

      <div className="webtoon-thumbnail">
        <img className="first-layer-image" src={webtoonData.thumbnail_first_layer} />
        <img className="second-layer-image" src={webtoonData.thumbnail_second_layer} />
        {webtoonData.platform === 'NAVER' && <div className="w-100p h-100w" style={{ backgroundColor: `#${webtoonData.thumbnail_bg_color.split('#')[1]}` }} />}
        <div className="team-label">
          <img src={`/icons/ic_${webtoonData.webtoon_data[0].is_completed ? 'complete' : 'proceed'}_status.svg`} alt="Status" width={48} height={20} />
          <img src={`/icons/ic_${webtoonData.platform.toLowerCase()}.svg`} alt={webtoonData.platform} width={68} height={20} />
        </div>
      </div>
      {!!webtoonData.webtoon_data[0]?.paid_date && diffDate < 0 && (
        <div className="webtoon-info">
          <div>
            <img src="/icons/ic_pig.svg" alt="empty" width={48} height={54} />
          </div>
          <div>
            <div className="save-money-info">
              지금 보면 <br />
              최대 <span className="highlight">{setComma(saveMoney)}원</span>을 아낄 수 있어요!
            </div>
          </div>
        </div>
      )}

      <div className="ps-16">
        <div className="divider" />
      </div>
      <div className="content">
        <div className="webtoon-score">
          {webtoonData.webtoon_data[0].view_count && (
            <>
              <div className="score">
                <img src="/icons/ic_eye_red.svg" alt="eye" width={16} height={16} />
                {setComma(webtoonData.webtoon_data[0].view_count)}
              </div>
              <div className="webtoon-score-divider" />
            </>
          )}
          {webtoonData.webtoon_data[0].rating && (
            <>
              <div className="score">
                <img src="/icons/ic-star.svg" alt="star" width={16} height={16} />
                {setComma(webtoonData.webtoon_data[0].rating || 0)}
              </div>
              <div className="webtoon-score-divider" />
            </>
          )}
          <div className="score">
            <img src="/icons/ic-heart.svg" alt="star" width={16} height={16} />
            {setComma(webtoonData.webtoon_data[0].like_count || 0)}
          </div>
        </div>

        <div className="webtoon-detail-info">
          <div className="webtoon-info-type">작품소개</div>
          <div className="webtoon-info-story webtoon-desc">
            <p onClick={showDesc}>{webtoonData.description}</p>
          </div>
        </div>
        <div className="webtoon-detail-info">
          <div className="webtoon-info-type">글/그림</div>
          <div className="webtoon-info-story">
            <p>
              {webtoonData.author}
              {webtoonData.drawer && ` / ${webtoonData.drawer}`}
            </p>
          </div>
        </div>
        <div className="webtoon-detail-info">
          <div className="webtoon-info-type">장르</div>
          <div className="webtoon-info-story">
            <p>{webtoonData.origin_genre}</p>
          </div>
        </div>
        <div className="webtoon-detail-info">
          <div className="webtoon-info-type">연령대</div>
          <div className="webtoon-info-story">
            {webtoonData.is_censored && webtoonData.platform === 'NAVER' && <p className="color-red">만 18세 이상</p>}
            {webtoonData.is_censored && webtoonData.platform === 'KAKAO' && <p className="color-red">만 19세이상</p>}
            {!webtoonData.is_censored && <p>전체연령가</p>}
          </div>
        </div>

        {!!webtoonData.webtoon_data[0]?.paid_date && diffDate < 0 && (
          <div className="pay-per-view-schedule">
            <img src="/icons/ic_talk.svg" alt="arrow" width={180} height={43} />
            <div className="pay-to-show">{dayjs(webtoonData.webtoon_data[0]?.paid_date).format('YYYY[년] MM[월] DD[일]')} 유료화</div>
          </div>
        )}

        <div className="webtoon-link-content">
          <Link href={webtoonData.webtoon_url} className="pointer">
            <div className="webtoon-site-link-btn">바로 정주행 하기!</div>
          </Link>
        </div>
      </div>

      {isShareModal && (
        <div
          className="share-modal-wrapper"
          ref={outSection}
          onClick={(e) => {
            if (outSection.current === e.target) {
              closeModal();
            }
          }}>
          <div className="modal_content">
            <div className="title">
              <p>서비스 친구에게 소개하기</p>
              <img onClick={closeModal} className="btn_close pointer" src="/icons/ic_close.svg" />
            </div>

            <div className="content">
              <p>웹툰투데이를 친구들에게 공유하세요!</p>
            </div>

            <div className="modal_actions">
              <img className="pointer" onClick={() => handleClickShare('facebook')} src="/icons/ic-share-facebook.svg" />
              <img className="pointer" onClick={() => handleClickShare('kakao')} src="/icons/ic-share-kakao.svg" />
              <img className="pointer" onClick={() => handleClickShare('twitter')} src="/icons/ic-share-twitter.svg" />
              <img className="pointer" onClick={handleShareUrl} src="/icons/ic-share-url.svg" />
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default WebtoonDetail;
