import React from 'react';
import { TFunction } from 'i18next';

interface MsgGuardBuyProps extends GuardBuyMsg {
  t: TFunction;
}

export default function MsgGuardBuy(props: MsgGuardBuyProps) {
  const { t, ...msg } = props;
  return (
    <div className="chat-item misc-msg guard-buy">
      <span className="username v-bottom">{msg.username}</span>
      <span>
        {t('DanmakuGuardBuy')}
        {props.giftName}
      </span>
      <span
        className={`guard-icon level-${msg.guardLevel} dp-i-block v-bottom pointer`}
        role="img"
      />
      <span className="count v-bottom">
        X {msg.giftCount}
        {t('DanmakuGuardBuyTime')}
      </span>
    </div>
  );
}
