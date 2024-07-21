'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';

export default function ClientApplication({ children }: { children: ReactNode }) {
  // useEffect(() => {
  //   console.log(process.env)
  //   console.log(process.env.NEXT_PUBLIC_KAKAO_API_KEY)
  //   // @ts-ignore
  //   window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);

  //   window.onbeforeunload = function () {
  //     window.scrollTo(0, 0);
  //   };
  // }, []);

  const queryClient = new QueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
