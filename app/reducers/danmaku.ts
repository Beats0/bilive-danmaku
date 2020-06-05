import { danmakuStateType } from './types';
import Socket from '../components/Danmaku/base/Socket';
import {
  CREATESOCKET,
  FETCHGIFTDATA,
  DanmakuActionTypes
} from '../actions/danmaku';
import config from '../config';

const initState: danmakuStateType = {
  roomid: config.roomid,
  socket: new Socket(config.roomid),
  giftMap: new Map<number, GiftRaw>(),
  userAvatarMap: new Map<number, string>()
};

export default function danmaku(state = initState, action: DanmakuActionTypes) {
  switch (action.type) {
    case CREATESOCKET:
      const { roomid } = action.payload;
      return { ...state, roomid, socket: new Socket(roomid) };
    case FETCHGIFTDATA:
      const { giftMap } = action.payload;
      return { ...state, giftMap };
    default:
      return state;
  }
}
