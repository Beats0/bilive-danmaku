import { useTranslation } from 'react-i18next';

export default function MsgConnectSuccess() {
  const { t } = useTranslation();
  return <div className="danmakuItem">{t('SocketConnectSuccess')}</div>;
}
