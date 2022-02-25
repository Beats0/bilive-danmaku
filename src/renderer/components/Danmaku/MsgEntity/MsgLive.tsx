import { useTranslation } from 'react-i18next';

export default function MsgLive() {
  const { t } = useTranslation();
  return <div className="danmakuItem">{t('DanmakuLive')}</div>;
}
