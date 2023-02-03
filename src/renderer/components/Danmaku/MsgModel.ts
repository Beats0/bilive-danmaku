/* eslint-disable no-case-declarations */
/* eslint-disable consistent-return */

import UserInfoApiTask, { apiTaskConfig } from '../../api';
import config from '../../config';
import UserAvatarDao from '../../dao/UserAvatarDao';
import { sleep } from '../../utils/common';

export enum CmdType {
  CONNECTING = 'CONNECTING',
  DISCONNECTED = 'DISCONNECTED',
  CONNECT_SUCCESS = 'CONNECT_SUCCESS',
  LIVE = 'LIVE',
  POPULAR = 'POPULAR',
  DANMU_MSG = 'DANMU_MSG',
  SEND_GIFT = 'SEND_GIFT',
  SPECIAL_GIFT = 'SPECIAL_GIFT',
  COMBO_SEND = 'COMBO_SEND',
  COMBO_END = 'COMBO_END',
  NOTICE_MSG = 'NOTICE_MSG',
  INTERACT_WORD = 'INTERACT_WORD',
  ENTRY_EFFECT = 'ENTRY_EFFECT',
  ROOM_BLOCK_MSG = 'ROOM_BLOCK_MSG',
  WELCOME = 'WELCOME',
  WELCOME_GUARD = 'WELCOME_GUARD',
  GUARD_BUY = 'GUARD_BUY',
  SUPER_CHAT_MESSAGE = 'SUPER_CHAT_MESSAGE',
  WARNING = 'WARNING',
  CUT_OFF = 'CUT_OFF',
  UNKNOWN = 'UNKNOWN',
}

function assertUnknownCmdType(cmd: any): UnknownMsg {
  return {
    cmd,
    content: `Unknown cmd: ${cmd}`
  };
}

export async function parseData(
  data: DanmakuData
): Promise<DanmakuDataFormatted> {
  switch (data.cmd) {
    case CmdType.LIVE:
      break;
    case CmdType.DANMU_MSG:
      const userID = data.info['2']['0'];
      const danmakuMsg: DanmakuMsg = {
        cmd: CmdType.DANMU_MSG,
        username: data.info['2']['1'],
        userID,
        isAdmin: !!data.info['2']['2'],
        isVip: !!data.info['2']['3'],
        isVipM: !!data.info['2']['3'],
        isVipY: !!data.info['2']['4'],
        guardLevel: data.info['7'],
        content: data.info['1'],
        fanLv: data.info['3']['0'],
        fanName: data.info['3']['1'],
        liveUp: data.info['3']['2'],
        liveRoomID: data.info['3']['3'],
        userLevel: data.info['4']['0'] || 0,
        repeat: 0
      };
      if (config.showAvatar) {
        // 先查询Dao,如果有就直接添加
        if (UserAvatarDao.has(userID)) {
          danmakuMsg.face = UserAvatarDao.get(userID).avatar;
        } else {
          // 如果没有添加UserInfoApiTask，
          UserInfoApiTask.push(userID);
          // 频繁请求api会导致被ban，据说间隔时间为170
          if (
            UserInfoApiTask.getTaskQueueLength() <= apiTaskConfig.taskMaxLength
          ) {
            await sleep(apiTaskConfig.sleepMs);
          }
          danmakuMsg.face = UserAvatarDao.get(userID).avatar;
        }
      }
      return danmakuMsg;
    case CmdType.SEND_GIFT:
      const danmakuGiftMsg: GiftBubbleMsg = {
        cmd: CmdType.SEND_GIFT,
        username: data.data.uname,
        userID: data.data.uid,
        face: data.data.face,
        giftName: data.data.giftName,
        action: data.data.action,
        giftCount: data.data.num,
        coinType: data.data.coin_type,
        totalCoin: data.data.total_coin,
        price: data.data.num * data.data.price,
        giftAction: data.data.action,
        giftId: data.data.giftId
      };

      if (data.data.batch_combo_id) {
        danmakuGiftMsg.batchComboId = data.data.batch_combo_id;
      }
      if (data.data.super_gift_num) {
        danmakuGiftMsg.superGiftNum = data.data.super_gift_num;
        danmakuGiftMsg.superBatchGiftNum = data.data.super_batch_gift_num;
        danmakuGiftMsg.comboStayTime = data.data.combo_stay_time;
      }
      return danmakuGiftMsg;
    case CmdType.WELCOME:
      const welcomeMsg: MsgWelcome = {
        cmd: CmdType.WELCOME,
        username: data.data.uname,
        userID: data.data.uid,
        isAdmin: !!data.data.is_admin,
        isVip: !!data.data.vip,
        isVipM: data.data.vip === 1,
        isVipY: data.data.svip === 1
      };
      return welcomeMsg;
    case CmdType.WELCOME_GUARD:
      const welcomeguardMsg: MsgWelcomeGuard = {
        cmd: CmdType.WELCOME_GUARD,
        username: data.data.username,
      };
      return welcomeguardMsg;
    case CmdType.INTERACT_WORD:
      const interActWordMsg: MsgInterActWordMsg = {
        cmd: CmdType.INTERACT_WORD,
        msgType: data.data.msg_type,
        username: data.data.uname,
        userID: data.data.uid,
      };
      return interActWordMsg;
    case CmdType.GUARD_BUY:
      const guardBuyMsg: GuardBuyMsg = {
        cmd: CmdType.GUARD_BUY,
        username: data.data.username,
        userID: data.data.uid,
        guardLevel: data.data.guard_level,
        giftName: ['', '总督', '提督', '舰长'][data.data.guard_level],
        giftCount: data.data.num
      };
      return guardBuyMsg;
    case CmdType.SUPER_CHAT_MESSAGE:
      const superChatMsg: SUPER_CHAT_MESSAGE = {
        cmd: CmdType.SUPER_CHAT_MESSAGE,
        data: data.data
      };
      return superChatMsg;
    case CmdType.COMBO_SEND:
      const comboSendMsg: GiftBubbleMsg = {
        cmd: CmdType.COMBO_SEND,
        userID: data.data.uid,
        username: data.data.uname,
        giftName: data.data.gift_name,
        giftId: data.data.gift_id,
        comboId: data.data.combo_id,
        comboNum: data.data.combo_num,
        batchComboId: data.data.batch_combo_id,
        action: data.data.action
      };
      return comboSendMsg;
    case CmdType.POPULAR:
      const popularMsg: POPULAR = {
        cmd: CmdType.POPULAR,
        popular: data.popular
      };
      return popularMsg;
    // case CmdType.COMBO_END:
    //   // TODO:
    //   break;
    case CmdType.ROOM_BLOCK_MSG:
      const roomBlockMsg: MsgRoomBlockMsg = {
        cmd: CmdType.ROOM_BLOCK_MSG,
        username: data.data.uname,
        userID: data.data.uid,
      };
      return roomBlockMsg;
    case CmdType.WARNING:
      const warningMsg: WarningMsg = {
        cmd: CmdType.WARNING,
        msg: data.msg,
      };
      return warningMsg;
    case CmdType.CUT_OFF:
      const cutOffMsg: CutOffMsg = {
        cmd: CmdType.CUT_OFF,
        msg: data.msg,
      };
      return cutOffMsg;
    default:
      return assertUnknownCmdType(data.cmd);
  }
}
