export const sendGaEvent = (text: string) => {
  window.gtag('event', text, { send_to: 'G-RBTEKD8D4E' });
};
