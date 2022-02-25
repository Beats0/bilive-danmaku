import { useTranslation } from 'react-i18next';
import MsgVip from './MsgVip';
import { useAppSelector } from '../../../store/hooks';
import { selectConfig } from '../../../store/features/configSlice';

function MsgWelcome(props: MsgWelcome) {
  const { ...msg } = props;
  const { t } = useTranslation();
  const config = useAppSelector(selectConfig);
  if (config.blockEffectItem2 === 1) return null;

  return (
    <div className="danmakuItem chat-item welcome-msg">
      <MsgVip {...props} />
      <span className="username v-middle vip">{msg.username} 老爷</span>
      <span className="action v-middle">{t('DanmakuWelcomeLiveRoom')}</span>
    </div>
  );
}

export default MsgWelcome;
