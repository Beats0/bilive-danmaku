import { sortBy, unionSet } from '../utils/common';

const prefixKey = 'liveRoomData';

export interface LiveRoomData {
  // 房间号
  roomid: number;
  // 房间短号(如果api返回 0， shortid 为 roomid)
  shortid: number;
  uid: number;
  // 上次数据添加时间
  lastTime: number;
}

const defaultLiveRoomData: LiveRoomData = {
  roomid: 292397,
  shortid: 292397,
  uid: 425286,
  lastTime: Date.now()
};

export default class LiveRoomDao {
  static get(shortid: number): LiveRoomData {
    let lists = this.getLists();
    lists = lists.filter(i => i.shortid === shortid);
    return lists[0];
  }

  // 获取上一次的直播间
  static getResent(): LiveRoomData {
    const lists = this.getLists();
    return lists[0];
  }

  // 获取直播间历史记录列表(按时间倒序排列)
  static getLists(): LiveRoomData[] {
    const liveRoomStr = localStorage.getItem(prefixKey);
    if (!liveRoomStr) {
      return [defaultLiveRoomData];
    }
    // 防止数据为空，为空时返回默认 LiveRoomData[]
    const lists: LiveRoomData[] = JSON.parse(liveRoomStr);
    if (lists.length === 0) {
      return [defaultLiveRoomData];
    }
    return lists.sort(sortBy('lastTime', false));
  }

  static save(data: LiveRoomData) {
    let lists = this.getLists();
    lists.unshift(data);
    lists = unionSet(lists, 'roomid');
    localStorage.setItem(prefixKey, JSON.stringify(lists));
  }

  static delete(shortid: number) {
    let lists = this.getLists();
    lists = lists.filter(i => i.shortid !== shortid);
    localStorage.setItem(prefixKey, JSON.stringify(lists));
  }
}
