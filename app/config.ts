import ConfigDao from './dao/ConfigDao';

const config = ConfigDao.get();

export function setConfig(configKey: string, value: string | number) {
  console.log('configKey', configKey, 'value', value);
  config[configKey] = value;
  ConfigDao.save(config);
}

// 直接挂载到全局
global.config = config;

export default config;
