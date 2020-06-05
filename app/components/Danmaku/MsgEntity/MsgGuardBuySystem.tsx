import React from 'react';
import { TFunction } from 'i18next';

interface MsgGuardBuyProps extends GuardBuyMsg {
  t: TFunction;
}

export default function MsgGuardBuy(props: MsgGuardBuyProps) {
  const { t, ...msg } = props;
  return (
    <div className="chat-item system-msg guard-buy border-box">
      <span
        className={`guard-icon msg-icon level-${msg.guardLevel} dp-i-block v-bottom`}
        role="img"
      />
      <div className="msg-content p-relative" style={{ color: '#EF903A' }}>
        <span>
          <span style={{ color: '#D54900' }} className="v-middle">
            {msg.username}
          </span>
          <span style={{ color: '#EF903A' }} className="v-middle">
            {t('DanmakuGuardBuyInRoom')}
            {msg.giftName}
          </span>
        </span>
      </div>
    </div>
  );
}
