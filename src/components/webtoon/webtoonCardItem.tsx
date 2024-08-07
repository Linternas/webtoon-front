import Link from 'next/link';
import { setComma } from '@/utils/number-format.utils';
import { CalendarWebtoon } from '@/types/webtoon';
import Image from 'next/image';

const CalendarWebtoonItem = ({ id, title, webtoon_data, author, thumbnail_first_layer, thumbnail_second_layer, thumbnail_bg_color, platform, is_censored }: CalendarWebtoon) => {
  const isNaver = platform === 'NAVER';
  const isKakao = platform === 'KAKAO';
  const rating = webtoon_data[0]?.rating ?? 0;
  const likeCount = webtoon_data[0]?.like_count ?? 0;

  return (
    <Link href={`/webtoon/${id}`} className="pointer">
      <div className="calendar-webtoon-genre-item">
        {is_censored && <Image className="ic-censored" src="/icons/ic-censored.svg" alt="Censored" width="12" height="12" />}
        <div className="main-img-section">
          {thumbnail_bg_color && <div style={{ backgroundColor: thumbnail_bg_color.split(':')[1] }} className="background"></div>}
          {thumbnail_first_layer && <img className="background2" src={thumbnail_first_layer} alt="Thumbnail 1" />}
          {thumbnail_second_layer && <img className="background" src={thumbnail_second_layer} alt="Thumbnail 2" />}
        </div>

        <div className="content">
          <div className="title_wrapper flex">
            <p className="webtoon-title">{title}</p>
            <div className="img-section">
              {isNaver && <img src="/icons/ic-naver-w.svg" alt="Naver" />}
              {isKakao && <img src="/icons/ic-kakao-w.svg" alt="Kakao" />}
            </div>
          </div>

          <div className="flex">
            <p className="webtoon-writer">{author}</p>
          </div>

          <div className="flex align-center">
            {rating > 0 && (
              <>
                <img src="/icons/ic-star.svg" alt="Rating" />
                <p className="linked">{rating}</p>
              </>
            )}

            {rating > 0 && likeCount > 0 && <div className="divider"></div>}

            {likeCount > 0 && (
              <>
                <img src="/icons/ic-heart.svg" alt="Likes" />
                <p className="linked">{setComma(likeCount)}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CalendarWebtoonItem;
