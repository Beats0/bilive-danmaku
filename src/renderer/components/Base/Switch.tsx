import React from 'react';

export type SwitchStatus = 0 | 1;

type Props = {
  status: SwitchStatus;
  onChange?: (status: SwitchStatus) => void;
  disabled?: boolean;
};

export default function Switch(props: Props) {
  const { status = 0, onChange, disabled = false } = props;
  const changeStatus = status === 0 ? 1 : 0;

  const handleClick = () => {
    if (disabled) return;
    onChange && onChange(changeStatus);
  };

  return (
    <div className={`bl-switch v-middle ${disabled ? 'bl-switch-disabled' : ''} bl-switch-${status === 0 ? 'default' : 'checked'}`} onClick={handleClick}>
      <span className="bl-switch-inner" />
    </div>
  );
}
