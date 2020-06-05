import React, { useState, useEffect } from 'react';

type Props = {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (status: number) => void;
};

export default function Slider(props: Props) {
  const { min = 0, max = 100, step = 5, onChange } = props;
  const value = Number(props.value) || 0;
  const [currentValue, setCurrentValue] = useState<number>(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const rule = Math.floor(((currentValue - min) / (max - min)) * 100);

  return (
    <input
      value={currentValue}
      type="range"
      min={min}
      max={max}
      step={step}
      onChange={e => setCurrentValue(Number(e.target.value))}
      onMouseUp={() => onChange && onChange(currentValue)}
      className="range-input chrome"
      style={{
        background: `linear-gradient(to right, rgb(35, 173, 229), rgb(35, 173, 229) ${rule}%, rgb(227, 232, 236) ${rule}%, rgb(227, 232, 236))`
      }}
    />
  );
}
