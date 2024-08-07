'use client';

import { useRef, useState } from 'react';

import { toast } from 'react-toastify';

import { shareToFacebook, shareToTwitter, shareToKakao } from '@/utils/sns-share.utils';

import '@/styles/footer.scss';
import Image from 'next/image';

const Footer = () => {
  const [isShareModal, setIsShareModal] = useState(false);
  const outSection = useRef(null);

  const handleClickShare = () => {
    setIsShareModal(true);
  };

  const closeModal = () => {
    setIsShareModal(false);
  };

  const newTabBuyMeACoffe = () => {
    window.open('https://www.buymeacoffee.com/todaytoon', '_blank');
    window.gtag('event', '웹툰투데이_후원하기', { send_to: 'G-RBTEKD8D4E' });
  };

  const handleClickAboutUs = () => {
    window.open('https://todaytoon.oopy.io/', '_blank');
    window.gtag('event', '웹툰투데이_팀소개', { send_to: 'G-RBTEKD8D4E' });
  };

  const handleShareFacebook = () => {
    shareToFacebook();
    window.gtag('event', '웹툰투데이_공유하기', { send_to: 'G-RBTEKD8D4E' });
  };

  const handleShareTwitter = () => {
    shareToTwitter(`오늘 보면 웹툰가격원 아낄 수 있는 웹툰 알려드림`, '');

    if (document.querySelector('.b-test') === null) {
      shareToTwitter('내일이면 유료화되는 웹툰이 궁금하다면?', 'https://todaytoon.me');
    } else {
      shareToTwitter('지금 봐야 무료인 웹툰이 궁금하다면?', 'https://todaytoon.me');
    }

    window.gtag('event', '웹툰투데이_공유하기', { send_to: 'G-RBTEKD8D4E' });
  };

  const handleClickServay = () => {
    window.open('https://docs.google.com/forms/d/1pSFMT028641RKxr1ougTn3gzqb_pxWr8KyOxjQVt1oY/edit?usp=sharing', '_blank');
    window.gtag('event', '웹툰투데이_피드백', { send_to: 'G-RBTEKD8D4E' });
  };

  const handleShareKakao = () => {
    if (document.querySelector('.b-test') === null) {
      shareToKakao('내일이면 유료화되는 웹툰이 궁금하다면?', '#웹툰투데이 #웹툰정주행 #오늘까지_무료', 'https://ifh.cc/g/6FyVQj.png', 'https://todaytoon.me');
    } else {
      shareToKakao('지금 봐야 무료인 웹툰이 궁금하다면?', '#웹툰투데이 #웹툰정주행 #오늘까지_무료', 'https://ifh.cc/g/6FyVQj.png', 'https://todaytoon.me');
    }

    window.gtag('event', '웹툰투데이_공유하기', { send_to: 'G-RBTEKD8D4E' });
  };

  const handleShareUrl = () => {
    const url = 'https://todaytoon.me';

    const t = document.createElement('textarea');
    document.body.appendChild(t);
    t.value = url;
    t.select();
    document.execCommand('copy');
    document.body.removeChild(t);

    toast('클립보드에 복사되었습니다.', {
      position: 'bottom-center',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    window.gtag('event', '웹툰투데이_공유하기', { send_to: 'G-RBTEKD8D4E' });
  };

  return (
    <div className="footer-wrapper">
      <div className="section_logo">
        <p className="logo">웹툰투데이</p>
        <p className="team">by.즐겨찾기팀</p>
      </div>

      <div className="section-content">
        <div className="item-layout">
          <div className="item pointer" onClick={handleClickShare}>
            <p>서비스 친구에게 소개하기</p>
            <Image src="/icons/ic_thumbs_up.svg" alt="ThumbUp" width={20} height={20} />
          </div>

          <div className="ml-10"></div>

          <div className="item pointer" onClick={handleClickAboutUs}>
            <p>About Us</p>
            <Image src="/icons/ic_raising_hands.svg" alt="RaisingHands" width={20} height={20} />
          </div>
        </div>

        <div className="item-layout mt-8">
          <div className="item pointer" onClick={handleClickServay}>
            <p>더 나은 서비스를 위해 피드백 남기기</p>
            <Image src="/icons/ic_memo.svg" alt="Memo" width={20} height={20} />
          </div>

          <div className="ml-10"></div>

          <div className="item pointer" onClick={newTabBuyMeACoffe}>
            <p>후원하기</p>
            <Image src="/icons/ic_love_letter.svg" alt="LoverLetter" width={20} height={20} />
          </div>
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
              <img className="pointer" onClick={handleShareFacebook} src="/icons/ic-share-facebook.svg" />
              <img className="pointer" onClick={handleShareKakao} src="/icons/ic-share-kakao.svg" />
              <img className="pointer" onClick={handleShareTwitter} src="/icons/ic-share-twitter.svg" />
              <img className="pointer" onClick={handleShareUrl} src="/icons/ic-share-url.svg" />
            </div>
          </div>
        </div>
      )}

      <p className="footer-notice">
        본 사이트에 제공하는 웹툰 정보는 웹툰 서비스 제공 사이트를 토대로 업데이트 됩니다. 본 사이트는 &quot;있는 그대로&quot; 정보를 제공하고 있으며, 사용에 대한 책임은 전적으로 사용자에게 있음을
        알립니다.
      </p>

      <p className="copyright">copyright(c) 2022 All rights reserved by 웹툰투데이.</p>
    </div>
  );
};

export default Footer;
