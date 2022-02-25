import { useTranslation } from 'react-i18next';

export default function MsgConnecting() {
  const { t } = useTranslation();
  return <div className="danmakuItem">{t('SocketDanmakuConnecting')}</div>;
}
