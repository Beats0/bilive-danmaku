import React from 'react';

export type SwitchStatus = 0 | 1;

type Props = {
  status: SwitchStatus;
  onChange?: (status: SwitchStatus) => void;
};

export default function Switch(props: Props) {
  const { status = 0, onChange } = props;
  const changeStatus = status === 0 ? 1 : 0;

  return (
    <div
      className={`bl-switch v-middle bl-switch-${
        status === 0 ? 'default' : 'checked'
      }`}
      onClick={() => onChange && onChange(changeStatus)}
    >
      <span className="bl-switch-inner" />
    </div>
  );
}
