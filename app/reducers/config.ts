import defaultConfig, { setConfig } from '../config';
import {
  ConfigActionTypes,
  FETCHVERSIONDATA,
  RESETCONFIG,
  UPDATECONFIG
} from '../actions/config';
import ConfigDao from '../dao/ConfigDao';

export default function config(
  state = defaultConfig,
  action: ConfigActionTypes
) {
  switch (action.type) {
    case UPDATECONFIG:
      const { k, v } = action.payload;
      const newState = { ...state };
      newState[k] = v;
      setConfig(k, v);
      return newState;
    case RESETCONFIG:
      const data = ConfigDao.reset();
      console.log('data', data)
      return data
    case FETCHVERSIONDATA:
      const { latestVersion } = action.payload;
      return { ...state, latestVersion };
    default:
      return state;
  }
}
