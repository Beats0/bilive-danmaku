import { configStateType } from '../reducers/types';
import LiveRoomDao from './LiveRoomDao';
import pkg from '../../package.json';

const prefixKey = 'config';

const resentLiveData = LiveRoomDao.getResent();

const defaultConfig: configStateType = {
  version: pkg.version,
  latestVersion: pkg.version,
  languageCode: 'zhCn',
  // 窗口置于顶层
  setAlwaysOnTop: 1,
  // 房间号
  roomid: resentLiveData.roomid,
  // 房间短号
  shortid: resentLiveData.shortid,
  // 显示头像
  showAvatar: 0,
  // 头像大小
  avatarSize: 24,
  // 显示粉丝头衔
  showFanLabel: 0,
  // 显示用户UL等级
  showLvLabel: 0,
  // 显示姥爷
  showVip: 0,
  // 背景颜色 0白色 1黑色
  backgroundColor: 1,
  // 背景透明度
  backgroundOpacity: 0.5,
  // 弹幕文字字体
  fontFamily: '',
  // 弹幕文字字号缩放
  fontSize: 17,
  // 弹幕文字行高
  fontLineHeight: 24,
  // 弹幕文字上边距
  fontMarginTop: 3,
  // 固定滚动
  blockScrollBar: 0,
  // 开启语音播放
  showVoice: 0,
  // 语音音量
  voiceVolume: 0.3,
  // 语音播放速度
  voiceSpeed: 1,
  // 是否自动翻译
  autoTranslate: 0,
  // 翻译输入语言： (auto)自动检测有时候不准确，所以建议设置指定翻译语言
  translateFrom: 'auto',
  // 翻译输出语言
  translateTo: 'ja',
  // 最大消息显示数量
  maxMessageCount: 200,
  // 语音队列任务最大值
  taskMaxLength: 5,
  // 朗读语言
  voiceTranslateTo: 'zhCn',
  // 开启全局屏蔽
  blockMode: 0,
  // 屏蔽礼物弹幕[0,1]
  blockEffectItem0: 0,
  // 屏蔽抽奖弹幕[0,1]
  blockEffectItem1: 0,
  // 屏蔽进场信息[0,1]
  blockEffectItem2: 1,
  // 屏蔽醒目留言[0,1]
  blockEffectItem3: 0,
  // 屏蔽冒泡礼物[0,1]
  blockEffectItem4: 0,
  // 显示最低金瓜子
  blockMinGoldSeed: 0,
  // 显示最低银瓜子
  blockMinSilverSeed: 10000,
  // 屏蔽弹幕列表
  blockDanmakuLists: [],
  // 屏蔽用户列表
  blockUserLists: [],
  // 屏蔽用户等级[0,60]
  blockUserLv: 0,
  blockUserNotMember: 0,
  blockUserNotBindPhone: 0,
  region: 'drag',
  cursor: 'default',
  showTransition: 1
};

export default class ConfigDao {
  static get(): configStateType {
    const configStr = localStorage.getItem(prefixKey);
    if (!configStr) return defaultConfig;
    const configData: configStateType = JSON.parse(configStr);
    configData.roomid = resentLiveData.roomid;
    configData.shortid = resentLiveData.shortid;
    return configData;
  }

  static save(config: configStateType) {
    localStorage.setItem(prefixKey, JSON.stringify(config));
  }

  static reset(): configStateType {
    localStorage.removeItem(prefixKey);
    this.save(defaultConfig);
    return defaultConfig;
  }
}
