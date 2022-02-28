import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';
import config, { setConfig } from '../../config';
import ConfigDao from '../../dao/ConfigDao';
import { getVersionInfo } from '../../api';

const initialState: ConfigStateType = {
  ...config,
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    updateConfig(state, { payload }) {
      const { k, v } = payload;
      state[k] = v;
      setConfig(k, v);
    },
    resetConfig(state) {
      state = ConfigDao.reset();
      window.location.reload();
    },
  },
});

export const fetchVersionInfo = () => async (dispatch) => {
  const latestVersion = await getVersionInfo();
  const versionData = {
    k: 'latestVersion',
    v: latestVersion,
  };
  dispatch(updateConfig(versionData));
};

export const { updateConfig, resetConfig } = configSlice.actions;
export const selectConfig = (state: RootState) => state.config;
export default configSlice.reducer;
