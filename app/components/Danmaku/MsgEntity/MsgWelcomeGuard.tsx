import React from 'react';
import { connect } from 'react-redux';
import { TFunction } from 'i18next';
import { configStateType, rootStatePropsType } from '../../../reducers/types';

interface MsgWelcomeProps extends MsgWelcomeGuard {
  t: TFunction;
  config: configStateType;
}

function MsgWelcomeGuard(props: MsgWelcomeProps) {
  const { t, config, ...msg } = props;
  if (config.blockEffectItem2 === 1) return null;

  return (
    <div className="danmakuItem chat-item welcome-guard">
      <span>
        <span className="text v-middle">{t('DanmakuWelcome')}</span>
        <i
          className={`guard-icon dp-i-block v-middle bg-center bg-no-repeat pointer guard-level-${msg.guardLevel}`}
        />
        <span className={`username v-middle level-${msg.guardLevel}`}>{msg.username}</span>
        <span className="text v-middle">{t('DanmakuWelcomeLiveRoom')}</span>
      </span>
    </div>
  );
}

function mapStateToProps(state: rootStatePropsType) {
  return {
    config: state.config
  };
}

export default connect(mapStateToProps)(MsgWelcomeGuard);
