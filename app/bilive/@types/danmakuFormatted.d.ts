/**
 * @author Beats0 https://github.com/Beats0
 * */

/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/class-name-casing */

interface Connecting {
  cmd: CmdType.CONNECTING;
}

interface DanmakuBase {
  [key: string]: any;
  roomID?: number;
  cmd: CmdType;
  fanLv: number;
  fanName: string;
  liveUp: string;
  liveRoomID: number | string;
  timesMap: number;
}

interface DanmakuUser extends DanmakuBase {
  username: string;
  userID: number;
  isAdmin: boolean;
  isVip: boolean;
  isVipM: boolean;
  isVipY: boolean;
  guardLevel: number;
  userLevel: number;
  face: string;
}

interface DanmakuGift {
  cmd: CmdType.SEND_GIFT;
  username: string;
  userID: number;
  face: string;
  giftName: string;
  giftCount: number;
  giftAction: '赠送' | '投喂';
  coinType: 'gold' | 'silver';
  totalCoin: number;
  price: number;
  giftId: number;
  batchComboId?: string;
  superGiftNum?: number;
  superBatchGiftNum?: number;
}

interface GiftSend {
  username: number;
  /** 送礼人 */
  userID: string;
  /** 连击次数 */
  comboNum: number;
  /** 礼物名 */
  giftName: string;
  /** 礼物ID */
  giftId: number;
  action: '赠送' | '投喂';
  comboId: string;
  batchComboId: string;
  comboStayTime: number;
}

interface DanmakuMsg extends DanmakuBase, DanmakuUser {
  content: string;
  repeat: number;
}

interface GuardBuyMsg {
  username: string;
  userID: number;
  guardLevel: number;
  giftName: string;
  giftCount: number;
}

interface MsgWelcomeGuard {
  username: string;
  guardLevel: number;
}

interface MsgWelcome {
  username: string;
}

type GiftBubbleMsg = COMBO_SEND | COMBO_END | DanmakuGift | GiftSend;

type DanmakuDataFormatted = Partial<
  Connecting &
    DanmakuMsg &
    POPULAR &
    GiftBubbleMsg &
    GuardBuyMsg &
    MsgWelcomeGuard &
    MsgWelcome
>;

type GiftRaw = {
  id: number;
  price: number;
  name: string;
  desc: string;
  coin_type: 'gold' | 'silver';
  frame_animation: string;
  img_basic: string;
  img_dynamic: string;
  gif: string;
  rights: string;
  webp: string;
};
