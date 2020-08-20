/* eslint-disable @typescript-eslint/camelcase */

import UserAvatarDao from '../dao/UserAvatarDao';
import { CmdType } from '../components/Danmaku/MsgModel';
import LiveRoomDao, { LiveRoomData } from '../dao/LiveRoomDao';
import pkg from '../package.json';
import config from '../config';

export interface UserInfo {
  face: string;
  level: number;
  mid: number;
  name: string;
}

export interface LiveRoom {
  roomid: number;
  shortid: number;
  uid: number;
  uname: string;
  face: string;
  title: string;
  isLive: boolean;
}

export interface LiveRoomInfoResponse {
  data?: {
    // 主播信息
    anchor_info: {
      base_info: {
        face: string;
        uname: string;
      };
    };
    // 直播间信息
    room_info: {
      uid: number;
      room_id: number;
      live_status: 0 | 1;
      short_id: 0 | number;
      title: string;
    };
  };
  message: string;
}

export interface ResentSuperChatResponse {
  code: 0 | number;
  data: {
    message_list: SUPER_CHAT_MESSAGE_DATA[];
  };
}

const API_USER_INFO = 'https://api.bilibili.com/x/space/acc/info';
const API_LIVEROOM_INFO =
  'https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom';
const API_GIFT_CONFIG = `https://api.live.bilibili.com/gift/v3/live/gift_config`;
const API_RESENT_SUPER_CHAT = `https://api.live.bilibili.com/av/v1/SuperChat/enable`;
const API_SERVER_PACKAGE = `https://cdn.jsdelivr.net/gh/Beats0/bilive-danmaku@master/package.json`;

// 获取用户信息
export async function getUserInfo(mid: number): Promise<UserInfo> {
  const defaultUserInfo: UserInfo = {
    face: 'https://static.hdslb.com/images/member/noface.gif',
    level: 0,
    mid,
    name: ''
  };

  return new Promise<UserInfo>((resolve, reject) => {
    // 被ban后不再请求api
    if (config.showAvatar === 0) {
      resolve(defaultUserInfo);
      return;
    }
    fetch(`${API_USER_INFO}?mid=${mid}`)
      .then(res => {
        // 如果检测到被ban后自动关闭显示头像功能
        if (res.status === 412) {
          console.warn('显示头像功能已关闭, 请稍后再试...');
          config.showAvatar = 0;
          return resolve(defaultUserInfo);
        }
        return res.json();
      })
      .then(res => {
        // 保存avatar
        UserAvatarDao.save(mid, res.data.face);
        resolve(res.data);
      })
      .catch(e => {
        console.log(e);
        resolve(defaultUserInfo);
      });
  });
}

// 获取礼物数据
export async function getGiftInfo(): Promise<Map<number, GiftRaw>> {
  const giftMap = new Map<number, GiftRaw>();
  return new Promise((resolve, reject) => {
    fetch(API_GIFT_CONFIG)
      .then(res => res.json())
      .then((res: { msg: string; data: any[] }) => {
        if (res.code === 0) {
          const { data } = res;
          for (let i = 0; i < data.length; i++) {
            giftMap.set(data[i].id, data[i]);
          }
          resolve(giftMap);
        }
      })
      .catch(error => {
        console.log(error);
        resolve(giftMap);
      });
  });
}

// 获取直播间信息
export async function getLiveRoomInfo(roomid: number): Promise<LiveRoom> {
  return new Promise<LiveRoom>((resolve, reject) => {
    fetch(`${API_LIVEROOM_INFO}?room_id=${roomid}`)
      .then(res => res.json())
      .then((data: LiveRoomInfoResponse) => {
        // 直播间加密等情况是没有数据的
        if (!data.data) throw new Error(data.message);

        const { face, uname } = data.data.anchor_info.base_info;
        const {
          uid,
          room_id,
          short_id,
          title,
          live_status
        } = data.data.room_info;
        const liveRoomDaoData: LiveRoomData = {
          uid,
          roomid: room_id,
          shortid: short_id || room_id,
          lastTime: Date.now()
        };
        // 保存到dao
        LiveRoomDao.save(liveRoomDaoData);
        const liveRoomData: LiveRoom = {
          roomid: room_id,
          shortid: short_id || room_id,
          uid,
          uname,
          face,
          title,
          isLive: live_status === 1
        };
        resolve(liveRoomData);
      })
      .catch(error => {
        console.log('error', error);
        const liveRoomData: LiveRoom = {
          roomid,
          shortid: roomid,
          uid: 0,
          uname: roomid.toString(),
          face: 'https://static.hdslb.com/images/member/noface.gif',
          title: error.message,
          isLive: false
        };
        resolve(liveRoomData);
      });
  });
}

// 获取直播间最近SC
export async function getResentSuperChat(
  roomid: number
): Promise<SUPER_CHAT_MESSAGE[]> {
  return new Promise<SUPER_CHAT_MESSAGE[]>((resolve, reject) => {
    fetch(`${API_RESENT_SUPER_CHAT}?room_id=${roomid}`)
      .then(res => res.json())
      .then((data: ResentSuperChatResponse) => {
        if (data.code !== 0) {
          resolve([]);
        } else {
          const lists = data.data.message_list;
          const scLists: SUPER_CHAT_MESSAGE[] = [];
          for (let i = 0; i < lists.length; i++) {
            const sc: SUPER_CHAT_MESSAGE = {
              cmd: CmdType.SUPER_CHAT_MESSAGE,
              data: lists[i]
            };
            scLists.push(sc);
          }
          resolve(scLists);
        }
      })
      .catch(error => {
        console.log('error', error);
        resolve([]);
      });
  });
}

// 获取服务器端version
export async function getVersionInfo(): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(API_SERVER_PACKAGE)
      .then(res => res.json())
      .then((res: { version: string }) => {
        resolve(res.version);
      })
      .catch(error => {
        console.log(error);
        resolve(pkg.version);
      });
  });
}

type Task = {
  uid: number;
};

const taskQueue: Task[] = [];
let isWorking = false;

// 设置为 1s 内不得请求超过5个api
export const apiTaskConfig = {
  taskMaxLength: 5,
  sleepMs: 200
};

async function handleTaskQueue() {
  isWorking = true;
  const task = taskQueue.shift();
  if (task) {
    await getUserInfo(task.uid);
    await handleTaskQueue();
  } else {
    isWorking = false;
  }
}

// 用户信息任务
const UserInfoApiTask = {
  push(uid: number) {
    if (taskQueue.length > apiTaskConfig.taskMaxLength) return;
    if (taskQueue.some(t => t.uid === uid)) return;
    taskQueue.push({ uid });
    if (!isWorking) {
      handleTaskQueue();
    }
  },
  getTaskQueueLength(): number {
    return taskQueue.length;
  }
};

export default UserInfoApiTask;
