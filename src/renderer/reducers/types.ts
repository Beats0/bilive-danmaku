import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';
import { SocketInstanceType } from '../components/Danmaku/base/Socket';

export enum ConfigKey {
  version = 'version',
  latestVersion = 'latestVersion',
  languageCode = 'languageCode',
  setAlwaysOnTop = 'setAlwaysOnTop',
  ignoreMouse = 'ignoreMouse',
  roomid = 'roomid',
  shortid = 'shortid',
  showAvatar = 'showAvatar',
  avatarSize = 'avatarSize',
  showFanLabel = 'showFanLabel',
  showLvLabel = 'showLvLabel',
  showVip = 'showVip',
  backgroundColor = 'backgroundColor',
  backgroundOpacity = 'backgroundOpacity',
  fontFamily = 'fontFamily',
  fontSize = 'fontSize',
  fontLineHeight = 'fontLineHeight',
  fontMarginTop = 'fontMarginTop',
  blockScrollBar = 'blockScrollBar',
  showVoice = 'showVoice',
  voiceVolume = 'voiceVolume',
  voiceSpeed = 'voiceSpeed',
  autoTranslate = 'autoTranslate',
  translateFrom = 'translateFrom',
  translateTo = 'translateTo',
  maxMessageCount = 'maxMessageCount',
  voiceTranslateTo = 'voiceTranslateTo',
  taskMaxLength = 'taskMaxLength',
  blockMode = 'blockMode',
  blockEffectItem0 = 'blockEffectItem0',
  blockEffectItem1 = 'blockEffectItem1',
  blockEffectItem2 = 'blockEffectItem2',
  blockEffectItem3 = 'blockEffectItem3',
  blockEffectItem4 = 'blockEffectItem4',
  blockEffectItem5 = 'blockEffectItem5',
  blockEffectItem6 = 'blockEffectItem6',
  blockMinGoldSeed = 'blockMinGoldSeed',
  blockMinSilverSeed = 'blockMinSilverSeed',
  blockDanmakuLists = 'blockDanmakuLists',
  blockUserLists = 'blockUserLists',
  blockUserLv = 'blockUserLv',
  blockUserNotMember = 'blockUserNotMember',
  blockUserNotBindPhone = 'blockUserNotBindPhone',
  showGiftDanmakuList = 'showGiftDanmakuList',
  maxDanmakuGiftCount = 'maxDanmakuGiftCount',
  danmakuGiftListHeight = 'danmakuGiftListHeight',
  showTransition = 'showTransition',
  ttsEngine = "ttsEngine",
  edgeTTSVoice = "edgeTTSVoice",
}

export type counterStateType = {
  count: number;
};

export type danmakuStateType = {
  roomid: number;
  socket: SocketInstanceType;
  giftMap: Map<number, GiftRaw>;
  userAvatarMap: Map<number, string>;
};

export type rootStatePropsType = {
  counter: counterStateType;
  danmaku: danmakuStateType;
  config: ConfigStateType;
};

export type GetState = () => rootStatePropsType;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<rootStatePropsType, Action<string>>;
