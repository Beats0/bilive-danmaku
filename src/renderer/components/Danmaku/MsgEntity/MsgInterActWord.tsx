import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../store/hooks';
import { selectConfig } from '../../../store/features/configSlice';
import { openLink } from '../../../utils/common';

function MsgInterActWord(props: MsgInterActWordMsg) {
  const { ...msg } = props;
  const { t } = useTranslation();
  const config = useAppSelector(selectConfig);
  let msgEntity = null;
  if (config.blockEffectItem2 === 1) return null;

  // msgType === 1 进入了直播间
  if (msg.msgType === 1) {
    msgEntity = (
      <div className="danmakuItem chat-item welcome-msg">
        <span className="username v-middle pointer" onClick={() => openLink(`https://space.bilibili.com/${msg.userID}`)}>{msg.username}</span>
        <span className="action v-middle"> {t('DanmakuWelcomeLiveRoom')}</span>
      </div>
    );
  } else if (msg.msgType === 2) {
    // msgType === 2 关注了直播间
    msgEntity = (
      <div className="danmakuItem chat-item welcome-msg">
        <span className="username v-middle pointer" onClick={() => openLink(`https://space.bilibili.com/${msg.userID}`)}>{msg.username}</span>
        <span className="action v-middle"> {t('DanmakuFollowedLiveRoom')}</span>
      </div>
    );
  }

  return msgEntity;
}

export default MsgInterActWord;
