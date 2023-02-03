import { useTranslation } from 'react-i18next';
import { openLink } from '../../../utils/common';

export default function MsgRoomBlock(props: MsgRoomBlockMsg) {
  const { ...msg } = props;
  const { t } = useTranslation();

  return (
    <div className="danmakuItem">
      <span>{t('DanmakuBlockedUser')}</span>
      <span className="username blocked v-bottom pointer" onClick={() => openLink(`https://space.bilibili.com/${msg.userID}`)}>{msg.username}</span>
      <span>{t('DanmakuBlockedText')}</span>
    </div>
  );
}
