import { animated, useSpring } from 'react-spring';
import { CmdType } from '../MsgModel';
import MsgWelcome from './MsgWelcome';
import MsgDanmu from './MsgDanmu';
import MsgLive from './MsgLive';
import MsgSendGift from './MsgSendGift';
import MsgWelcomeGuard from './MsgWelcomeGuard';
import MsgInterActWord from './MsgInterActWord';
import MsgGuardBuy from './MsgGuardBuy';
import MsgGuardBuySystem from './MsgGuardBuySystem';
import MsgConnecting from './MsgConnecting';
import MsgDisconnected from './MsgDisconnected';
import MsgConnectSuccess from './MsgConnectSuccess';
import MsgSuperChatCard from './MsgSuperChatCard';
import MsgRoomBlock from './MsgRoomBlock';

function FadeInUp({ children }) {
  const props = useSpring({
    from: {
      transform: 'translate3d(0, 100%, 0)',
      opacity: 0
    },
    to: {
      transform: 'translate3d(0, 0, 0)',
      opacity: 1
    }
  });
  return <animated.div style={props}>{children}</animated.div>;
}

interface MsgEntityProps extends DanmakuDataFormatted {
  cmd: string;
  key: string;
  showTransition: boolean;
  data?: any;
  showGift?: boolean;
}

export default function MsgEntity(props: MsgEntityProps) {
  const { cmd, showTransition, showGift = false } = props;
  let Msg = null;
  switch (cmd) {
    case CmdType.DANMU_MSG:
      Msg = <MsgDanmu {...props} />;
      break;
    case CmdType.SEND_GIFT:
      if (showGift) {
        Msg = <MsgSendGift { ...props } />;
      }
      break;
    case CmdType.CONNECTING:
      Msg = <MsgConnecting />;
      break;
    case CmdType.DISCONNECTED:
      Msg = <MsgDisconnected />;
      break;
    case CmdType.CONNECT_SUCCESS:
      Msg = <MsgConnectSuccess />;
      break;
    case CmdType.SUPER_CHAT_MESSAGE:
      Msg = <MsgSuperChatCard msg={props.data} style={{ marginTop: 10 }} />;
      break;
    case CmdType.LIVE:
      Msg = <MsgLive />;
      break;
    case CmdType.WELCOME:
      Msg = <MsgWelcome {...props} />;
      break;
    case CmdType.WELCOME_GUARD:
      Msg = <MsgWelcomeGuard {...props} />;
      break;
    case CmdType.INTERACT_WORD:
      if (showGift) {
        Msg = <MsgInterActWord {...props} />;
      }
      break;
    case CmdType.GUARD_BUY:
      Msg = [<MsgGuardBuy {...props} />, <MsgGuardBuySystem {...props} />];
      break;
    case CmdType.ROOM_BLOCK_MSG:
      Msg = <MsgRoomBlock {...props} />;
      break;
    default:
      return null;
  }
  return showTransition ? <FadeInUp>{Msg}</FadeInUp> : Msg;
}
