import LiveRoomDao from './LiveRoomDao';
import pkg from '../../../package.json';

const prefixKey = 'config';

const resentLiveData = LiveRoomDao.getResent();

export const defaultConfig: ConfigStateType = {
  version: pkg.version,
  latestVersion: pkg.version,
  languageCode: 'zhCn',
  setAlwaysOnTop: 1,
  roomid: resentLiveData.roomid,
  shortid: resentLiveData.shortid,
  ignoreMouse: 0,
  showAvatar: 1,
  avatarSize: 24,
  showFanLabel: 1,
  showLvLabel: 1,
  showVip: 1,
  backgroundColor: 1,
  backgroundOpacity: 0.5,
  fontFamily: '',
  fontSize: 17,
  fontLineHeight: 24,
  fontMarginTop: 3,
  blockScrollBar: 0,
  showVoice: 0,
  voiceVolume: 1,
  voiceSpeed: 1,
  autoTranslate: 0,
  translateFrom: 'auto',
  translateTo: 'ja',
  maxMessageCount: 500,
  taskMaxLength: 5,
  voiceTranslateTo: 'zhCn',
  blockMode: 0,
  blockEffectItem0: 0,
  blockEffectItem1: 0,
  blockEffectItem2: 1,
  blockEffectItem3: 0,
  blockEffectItem4: 0,
  blockEffectItem5: 0,
  blockEffectItem6: 0,
  blockMinGoldSeed: 0,
  blockMinSilverSeed: 0,
  blockDanmakuLists: [],
  blockUserLists: [],
  blockUserLv: 0,
  blockUserNotMember: 0,
  blockUserNotBindPhone: 0,
  showTransition: 1,
  showGiftDanmakuList: 0,
  maxDanmakuGiftCount: 30,
  danmakuGiftListHeight: 200,
  ttsEngine: 'edgeTTS',
  edgeTTSVoice: 'zh-CN-XiaoxiaoNeural',
};

export default class ConfigDao {
  static get(): ConfigStateType {
    const configStr = localStorage.getItem(prefixKey);
    if (!configStr) return defaultConfig;
    const configData: ConfigStateType = {
      ...defaultConfig,
      ...JSON.parse(configStr),
    };
    configData.version = pkg.version;
    // 与最新版config合并
    this.save(configData);
    return configData;
  }

  static save(config: ConfigStateType) {
    localStorage.setItem(prefixKey, JSON.stringify(config));
  }

  static reset(): ConfigStateType {
    localStorage.removeItem(prefixKey);
    this.save(defaultConfig);
    return defaultConfig;
  }
}
