import React from 'react';
import { TFunction } from 'i18next';

export default function MsgLive(props: { t: TFunction }) {
  const { t } = props;
  return <div className="danmakuItem">{t('DanmakuLive')}</div>;
}
