import React from 'react';
import { useTranslation } from 'react-i18next';
import Menu, { Item as MenuItem } from 'rc-menu';
import Dropdown from 'rc-dropdown';
import { ConfigKey, configStateType } from '../../../reducers/types';
import { HandleUpdateConfigFunc } from './DanmakuControl';
import lang from '../../../i18n/locales/lang.json';

interface Props {
  configKey: 'languageCode' | 'translateTo' | 'voiceTranslateTo';
  config: configStateType;
  handleUpdateConfig: HandleUpdateConfigFunc;
}

export default function LanguagePanel(props: Props) {
  const { configKey, config, handleUpdateConfig } = props;
  const { i18n } = useTranslation();

  function onSelect({ key }) {
    switch (configKey) {
      case 'languageCode':
        handleUpdateConfig(ConfigKey.languageCode, key);
        i18n.changeLanguage(key);
        break;
      case 'translateTo':
        handleUpdateConfig(ConfigKey.translateTo, key);
        break;
      case 'voiceTranslateTo':
        handleUpdateConfig(ConfigKey.voiceTranslateTo, key);
        break;
      default:
    }
  }

  const menu = (
    <Menu onSelect={onSelect}>
      {lang.map(l => (
        <MenuItem key={l.code}>{l.Language}</MenuItem>
      ))}
    </Menu>
  );

  const currentLang = lang.filter(i => i.code === config[configKey])[0];

  return (
    <Dropdown
      trigger={['click']}
      overlay={menu}
      animation="slide-up"
    >
      <span className="action-text cursor">
        {currentLang.Language}
        <span role="img" aria-label="down" className="action action-down">
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            className=""
            data-icon="down"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" />
          </svg>
        </span>
      </span>
    </Dropdown>
  );
}
