import { Dispatch } from '../reducers/types';
import { getVersionInfo } from '../api';

export const UPDATECONFIG = 'UPDATECONFIG';
export const RESETCONFIG = 'RESETCONFIG';
export const FETCHVERSIONDATA = 'FETCHVERSIONDATA';

export interface UpdateConfigAction {
  type: typeof UPDATECONFIG;
  payload: UpdateConfigPayload;
}

export interface UpdateConfigPayload {
  k: string;
  v: number | string;
}

export interface ResetConfigAction {
  type: typeof RESETCONFIG;
}

export interface FetchVersionDataAction {
  type: typeof FETCHVERSIONDATA;
  payload: {
    latestVersion: string;
  };
}

export type ConfigActionTypes =
  | UpdateConfigAction
  | ResetConfigAction
  | FetchVersionDataAction;

// 更新配置
export function updateConfig(payload: UpdateConfigPayload) {
  return {
    type: UPDATECONFIG,
    payload
  };
}

// 恢复默认配置
export function resetConfig() {
  return {
    type: RESETCONFIG
  };
}

// 获取服务器端version
export function fetchVersionData() {
  return async (dispatch: Dispatch) => {
    const latestVersion = await getVersionInfo();
    const action: FetchVersionDataAction = {
      type: FETCHVERSIONDATA,
      payload: {
        latestVersion
      }
    };
    dispatch(action);
  };
}
