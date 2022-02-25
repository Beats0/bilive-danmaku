import { useTranslation } from 'react-i18next';

export default function MsgDisconnected() {
  const { t } = useTranslation();
  return <div className="danmakuItem">{t('SocketDisconnected')}</div>;
}
