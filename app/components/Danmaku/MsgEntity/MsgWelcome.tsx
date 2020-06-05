import React from 'react';
import { connect } from 'react-redux';
import { TFunction } from 'i18next';
import MsgVip from './MsgVip';
import { configStateType, rootStatePropsType } from '../../../reducers/types';

interface MsgWelcomeProps extends MsgWelcome {
  t: TFunction;
  config: configStateType;
}

function MsgWelcome(props: MsgWelcomeProps) {
  const { t, config, ...msg } = props;
  if (config.blockEffectItem2 === 1) return null;

  return (
    <div className="danmakuItem chat-item welcome-msg">
      <MsgVip {...props} />
      <span className="username v-middle vip">{msg.username} 老爷</span>
      <span className="action v-middle">{t('DanmakuWelcomeLiveRoom')}</span>
    </div>
  );
}

function mapStateToProps(state: rootStatePropsType) {
  return {
    config: state.config
  };
}

export default connect(mapStateToProps)(MsgWelcome);
