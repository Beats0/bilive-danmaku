import React from 'react';
import { connect } from 'react-redux';
import { rootStatePropsType } from '../../../reducers/types';

interface VipProps {
  config: ConfigStateType;
  isVip: boolean;
  isVipM: boolean;
  isVipY: boolean;
}

function MsgVip(vip: VipProps) {
  if (vip.config.showVip === 0 || !vip.isVip) return null;
  if (vip.isVipY) {
    return <span className="vip-year">爷</span>;
  }
  if (vip.isVipM) {
    return <span className="vip-mouth">爷</span>;
  }
  return null;
}

function mapStateToProps(state: rootStatePropsType) {
  return {
    config: state.config
  };
}

export default connect(mapStateToProps)(MsgVip);
