import { Dispatch, GetState } from '../reducers/types';
import { getGiftInfo } from '../api';

export const CREATESOCKET = 'CREATESOCKET';
export const FETCHGIFTDATA = 'FETCHGIFTDATA';

export interface CreateSocketAction {
  type: typeof CREATESOCKET;
  payload: {
    roomid: number;
  };
}

export interface FetchGiftDataAction {
  type: typeof FETCHGIFTDATA;
  payload: {
    giftMap: Map<number, GiftRaw>;
  };
}

export type DanmakuActionTypes = CreateSocketAction | FetchGiftDataAction;

// 创建Socket
export function createSocket(roomid: number) {
  return (dispatch: Dispatch, getState: GetState) => {
    const { danmaku } = getState();
    // 关闭以前的socket
    danmaku.socket.close();
    const ation: CreateSocketAction = {
      type: CREATESOCKET,
      payload: {
        roomid
      }
    };
    dispatch(ation);
  };
}

// 获取礼物数据
export function fetchGiftData() {
  return async (dispatch: Dispatch) => {
    const giftMap = await getGiftInfo();
    const ation: FetchGiftDataAction = {
      type: FETCHGIFTDATA,
      payload: {
        giftMap
      }
    };
    dispatch(ation);
  };
}
