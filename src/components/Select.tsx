import { useEffect, useState } from 'react';
import ReactSelect, { ActionMeta, SingleValue } from 'react-select';

type SelectProps = {
  onChange: (newValue: SingleValue<{ value: string; label: string; }>, actionMeta: ActionMeta<{ value: string; label: string; }>) => void;
  options: { value: string; label: string }[];
  styles: any;
  currentValue: string;
}

const Select = ({onChange, options, styles, currentValue}: SelectProps) => {
  const [isMounted, setIsMounted] = useState(false);

  // Next 14에서 ReactSelect이 SSR을 지원하지 않아, 클라이언트에서만 렌더링되도록 수정
  // https://github.com/JedWatson/react-select/issues/5459.
  useEffect(() => {
    setIsMounted(true);
  }, [])

  return isMounted && (
    <ReactSelect
      onChange={onChange} 
      options={options}
      styles={styles} 
      isSearchable={false}
      value={options.filter((obj) => obj.value === currentValue)} 
      className="pointer" />
  )
}

export default Select;