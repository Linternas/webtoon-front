'use client';

import { sendGaEvent } from '@/utils/google-analytics';
import Link from 'next/link';

import '@/styles/header.scss';

const Header = () => {
  return (
    <div className="header-wrapper">
      <Link href="/">
        <h1 className="logo pointer">웹툰투데이</h1>
      </Link>

      <Link
        href="/search"
        onClick={() => {
          sendGaEvent('웹툰투데이_검색');
        }}>
        <img src="/icons/ic-search.svg" alt="검색" />
      </Link>
    </div>
  );
};

export default Header;
