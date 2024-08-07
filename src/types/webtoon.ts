export type CalendarWebtoon = {
  id:                     number;
  webtoon_data:           TWebtoonDetail[];
  title:                  string;
  author:                 string;
  origin_genre:           string;
  zfind_genre:            string;
  days:                   null;
  source_id:              string;
  drawer:                 string;
  platform:               string;
  thumbnail_first_layer:  string;
  thumbnail_second_layer: string;
  thumbnail_third_layer:  null;
  diffDate:               number;
  thumbnail_bg_color:     string;
  description:            string;
  simple_description:     string;
  webtoon_url:            string;
  is_censored:            boolean;
  paidYear:               string;
  paidMonth:              string;
  paidDay:                string;
  cookiePrice:            number;
  isSameDiffDate:         boolean;
  widthDiff?:             string;
}

export type CategoryWebtoon = {
  id:                     number;
  webtoon_data:           TWebtoonDetail[];
  title:                  string;
  author:                 string;
  origin_genre:           string;
  zfind_genre:            string;
  days:                   null | string;
  source_id:              string;
  drawer:                 null | string;
  platform:               Platform;
  thumbnail_first_layer:  string;
  thumbnail_second_layer: null | string;
  thumbnail_third_layer:  null;
  thumbnail_bg_color:     null | string;
  description:            string;
  simple_description:     null | string;
  webtoon_url:            string;
  is_censored:            boolean;
}

// export interface WebtoonDatum {
//   like_count:      number | null;
//   view_count:      null;
//   rating:          number | null;
//   is_completed:    boolean;
//   paid_status:     string;
//   paid_date:       string;
//   published_at:    Date;
//   ended_at:        null;
//   last_crawled_at: Date;
//   series_count:    number;
//   webtoon:         number;
// }

export type TWebtoonDetail = {
  like_count:      number | null;
  view_count:      null;
  rating:          number | null;
  is_completed:    boolean;
  paid_status:     PaidStatus;
  paid_date:       string;
  published_at:    Date;
  ended_at:        Date | null;
  last_crawled_at: Date;
  series_count:    number;
  webtoon:         number;
}

export enum Platform {
  Kakao = "KAKAO",
  Naver = "NAVER",
}

export enum PaidStatus {
  None = "NONE",
  무료 = "무료",
}
