import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { danmakuStateType } from '../../reducers/types';
import config from '../../config';
import Socket from '../../components/Danmaku/base/Socket';
import { getEmoticons, getGiftInfo } from "../../api";

const initialState: danmakuStateType = {
  roomid: config.roomid,
  socket: new Socket(config.roomid),
  giftMap: new Map<number, GiftRaw>(),
  emoticonsMap: new Map<string, EmoticonRaw>(),
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
    setEmoticonsData(state, action) {
      state.emoticonsMap = action.payload;
    },
  },
});

export const fetchGiftData = (roomID: number) => async (dispatch) => {
  const giftMap = await getGiftInfo(roomID);
  dispatch(setGiftData(giftMap));
};

export const fetchEmotionsData = (roomID: number) => async (dispatch) => {
  const emoticonsMap = await getEmoticons(roomID);
  dispatch(setEmoticonsData(emoticonsMap));
};

export const { setGiftData, createSocket, setEmoticonsData } = danmakuSlice.actions;
export const selectDanmaku = (state: RootState) => state.danmaku;
export default danmakuSlice.reducer;
