import UserInfoApiTask, { apiTaskConfig } from '../../api';
import config from '../../config';
import UserAvatarDao from '../../dao/UserAvatarDao';
import { sleep } from '../../utils/common';

export enum CmdType {
  CONNECTING = 'CONNECTING',
  DISCONNECTED = 'DISCONNECTED',
  LIVE = 'LIVE',
  POPULAR = 'POPULAR',
  DANMU_MSG = 'DANMU_MSG',
  SEND_GIFT = 'SEND_GIFT',
  SPECIAL_GIFT = 'SPECIAL_GIFT',
  COMBO_SEND = 'COMBO_SEND',
  COMBO_END = 'COMBO_END',
  NOTICE_MSG = 'NOTICE_MSG',
  WELCOME = 'WELCOME',
  WELCOME_GUARD = 'WELCOME_GUARD',
  GUARD_BUY = 'GUARD_BUY',
  SUPER_CHAT_MESSAGE = 'SUPER_CHAT_MESSAGE',
  UNKNOWN = 'UNKNOWN'
}

function assertUnknownCmdType(cmd: any): string {
  return `Unknown cmd: ${cmd}`;
}

export async function parseData(data: DanmakuData) {
  // console.log(data.cmd)
  // if((data.cmd === CmdType.SEND_GIFT && data.data.coin_type === 'gold') || data.cmd === CmdType.COMBO_SEND || data.cmd === CmdType.COMBO_END) {
  //   console.log(data.cmd, data, JSON.stringify(data));
  // }
  const msg: DanmakuDataFormatted = {
    cmd: data.cmd,
    timesMap: Date.now()
  };

  switch (data.cmd) {
    case CmdType.LIVE:
      break;
    case CmdType.DANMU_MSG:
      const userID = data.info['2']['0'];
      msg.username = data.info['2']['1'];
      msg.userID = userID;
      msg.isAdmin = !!data.info['2']['2'];
      msg.isVip = !!data.info['2']['3'];
      msg.isVipM = !!data.info['2']['3'];
      msg.isVipY = !!data.info['2']['4'];
      msg.guardLevel = data.info['7'];
      msg.content = data.info['1'];
      msg.fanLv = data.info['3']['0'];
      msg.fanName = data.info['3']['1'];
      msg.liveUp = data.info['3']['2'];
      msg.liveRoomID = data.info['3']['3'];
      msg.userLevel = data.info['4']['0'] || 0;
      msg.repeat = 0;
      if (config.showAvatar) {
        // 先查询Dao,如果有就直接添加
        if (UserAvatarDao.has(userID)) {
          msg.face = UserAvatarDao.get(userID).avatar;
        } else {
          // 如果没有添加UserInfoApiTask，
          UserInfoApiTask.push(userID);
          // 频繁请求api会导致被ban，据说间隔时间为170
          if (
            UserInfoApiTask.getTaskQueueLength() <= apiTaskConfig.taskMaxLength
          ) {
            await sleep(apiTaskConfig.sleepMs);
          }
          msg.face = UserAvatarDao.get(userID).avatar;
        }
      }
      break;
    case CmdType.SEND_GIFT:
      // console.log('SEND_GIFT', data);
      msg.username = data.data.uname;
      msg.userID = data.data.uid;
      msg.face = data.data.face;
      msg.giftName = data.data.giftName;
      msg.action = data.data.action;
      msg.giftCount = data.data.num;
      msg.coinType = data.data.coin_type;
      msg.totalCoin = data.data.total_coin;
      msg.price = data.data.num * data.data.price;
      msg.giftAction = data.data.action;
      msg.giftId = data.data.giftId;
      if (data.data.batch_combo_id) {
        msg.batchComboId = data.data.batch_combo_id;
      }
      if (data.data.super_gift_num) {
        msg.superGiftNum = data.data.super_gift_num;
        msg.superBatchGiftNum = data.data.super_batch_gift_num;
        msg.comboStayTime = data.data.combo_stay_time;
      }
      break;
    case CmdType.WELCOME:
      msg.username = data.data.uname;
      msg.userID = data.data.uid;
      msg.isAdmin = !!data.data.is_admin;
      msg.isVip = !!data.data.vip;
      msg.isVipM = data.data.vip === 1;
      msg.isVipY = data.data.svip === 1;
      break;
    case CmdType.WELCOME_GUARD:
      msg.username = data.data.username;
      msg.userID = data.data.uid;
      msg.guardLevel = data.data.guard_level;
      break;
    case CmdType.GUARD_BUY:
      msg.username = data.data.username;
      msg.userID = data.data.uid;
      msg.guardLevel = data.data.guard_level;
      msg.giftName = ['', '总督', '提督', '舰长'][msg.guardLevel];
      msg.giftCount = data.data.num;
      console.log(CmdType.GUARD_BUY, JSON.stringify(msg));
      break;
    case CmdType.SUPER_CHAT_MESSAGE:
      msg.data = data.data;
      break;
    case CmdType.COMBO_SEND:
      // console.log('COMBO_SEND', data)
      msg.userID = data.data.uid;
      msg.username = data.data.uname;
      msg.giftName = data.data.gift_name;
      msg.giftId = data.data.gift_id;
      msg.comboId = data.data.combo_id;
      msg.comboId = data.data.combo_id;
      msg.comboNum = data.data.combo_num;
      msg.batchComboId = data.data.batch_combo_id;
      msg.action = data.data.action;
      break;
    case CmdType.COMBO_END:
      // console.log('COMBO_END', data)
      break;
    case CmdType.POPULAR:
      break;
    default:
      // console.log('Unknown cmd:', data.cmd, data);
      assertUnknownCmdType(data.cmd);
      break;
  }
  return msg;
}
