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
  DANMU_MSG_ICON = 'DANMU_MSG_ICON',
  DANMU_MSG_CARD = 'DANMU_MSG_CARD',
  SEND_GIFT = 'SEND_GIFT',
  SPECIAL_GIFT = 'SPECIAL_GIFT',
  COMBO_SEND = 'COMBO_SEND',
  COMBO_END = 'COMBO_END',
  NOTICE_MSG = 'NOTICE_MSG',
  INTERACT_WORD = 'INTERACT_WORD',
  WATCHED_CHANGE = 'WATCHED_CHANGE',
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
  // console.log('msg',  data)
  switch (data.cmd) {
    case CmdType.LIVE:
      break;
    case CmdType.DANMU_MSG:
      const userID = data.info['2']['0'];
      let danmakuMsg: DanmakuMsg  = {
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
        repeat: 0,
      };
      // 从消息中获取
      if (data.info["0"]["15"] && data.info["0"]["15"]["user"]) {
        const face = data.info["0"]["15"]["user"].base.face
        UserAvatarDao.save(userID, face);
        danmakuMsg.face = face;
      } else if (UserAvatarDao.has(userID)) {
        // 从Dao中获取,如果有就直接添加
        danmakuMsg.face = UserAvatarDao.get(userID).avatar;
      }
      // DanmakuIcon
      if (data.info['0']['12'] === 1) {
        const danmakuIconMsg: DanmakuIcon = danmakuMsg
        danmakuIconMsg.cmd = 'DANMU_MSG_ICON'
        danmakuIconMsg.iconName = data.info['1']
        danmakuIconMsg.iconUrl = data.info['0']['13'].url
        danmakuIconMsg.width = data.info['0']['13'].width
        danmakuIconMsg.height = data.info["0"]["13"].height;
        if (danmakuIconMsg.width === danmakuIconMsg.height) {
          danmakuIconMsg.width = 36
          danmakuIconMsg.height = 36
        } else {
          const radio = danmakuIconMsg.width / danmakuIconMsg.height
          danmakuIconMsg.width = 28 * radio
          danmakuIconMsg.height = 28
        }
        return danmakuIconMsg;
      } else if (data.info['0']['12'] === 3 && data.info['0']['15']) {
        // card
        const danmakuCardMsg: DanmakuCard = danmakuMsg
        danmakuCardMsg.card_content = JSON.parse(data.info['0']['15'].extra).card.card_content
        danmakuCardMsg.cmd = 'DANMU_MSG_CARD'
        return danmakuCardMsg;
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
    case CmdType.WATCHED_CHANGE:
      const watchedChangeMsg: WATCHED_CHANGE = {
        cmd: CmdType.WATCHED_CHANGE,
        data: data.data
      };
      return watchedChangeMsg;
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
