import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { danmakuStateType } from '../../reducers/types';
import config from '../../config';
import Socket from '../../components/Danmaku/base/Socket';
import { getGiftInfo } from '../../api';

const initialState: danmakuStateType = {
  roomid: config.roomid,
  socket: new Socket(config.roomid),
  giftMap: new Map<number, GiftRaw>(),
  userAvatarMap: new Map<number, string>(),
};

export const danmakuSlice = createSlice({
  name: 'danmaku',
  initialState,
  reducers: {
    createSocket(state, action) {
      const roomid = action.payload;
      state.socket.close();
      state.roomid = roomid;
      state.socket = new Socket(roomid);
    },
    setGiftData(state, action) {
      state.giftMap = action.payload;
    },
  },
});

export const fetchGiftData = () => async (dispatch) => {
  const giftMap = await getGiftInfo();
  dispatch(setGiftData(giftMap));
};

export const { setGiftData, createSocket } = danmakuSlice.actions;
export const selectDanmaku = (state: RootState) => state.danmaku;
export default danmakuSlice.reducer;
