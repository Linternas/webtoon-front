/**
 * 숫자 콤마 생성 함수, 문자열은 제거됨
 *
 * @param {String} n
 * @param {Boolean} isMinus - 활성화 여부
 */
const setComma = (n: string | number) => {
  if (n === 0 || n === '0') {
    return _setComma(String(n).replace(/[^- 0-9]/g, ''));
  } else {
    return _setComma(String(n).replace(/\D/g, '').replace(/(^0+)/, ''));
  }
};

/**
 * 내부용 함수
 * while 돌면서 3자리마다 콤마 생성
 * @param {*} n
 */
const _setComma = (n: string) => {
  const reg = /(^[+-]?\d+)(\d{3})/;
  n += '';

  while (reg.test(n)) {
    n = n.replace(reg, '$1' + ',' + '$2');
  }

  return n;
};

/**
 * 콤마 제거 함수
 *
 * @param {*} n
 * @param {Boolean} isMinus - 활성화 여부
 */
const removeComma = (n: string | number, isMinus: boolean) => {
  if (n !== null && n !== '' && n !== undefined) {
    if (typeof n === 'number') {
      return n;
    } else {
      if (isMinus) {
        return n.replace(/[^- 0-9]/g, '').replace(/(^-+)0{0,}/g, '-');
      } else {
        return n.replace(/[^- 0-9]/g, '');
      }
    }
  }
};

const numberWithCommas = (num: number | string) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export { setComma, removeComma, numberWithCommas };
