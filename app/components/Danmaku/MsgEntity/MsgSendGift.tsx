import React from 'react';
import { connect } from 'react-redux';
import { configStateType, rootStatePropsType } from '../../../reducers/types';

interface GiftProps extends DanmakuGift {
  config: configStateType;
  giftMap: Map<number, GiftRaw>;
}

function MsgSendGift(props: GiftProps) {
  const { giftMap, config } = props;
  if (config.blockEffectItem0 === 1) return null;
  if (props.coinType === 'gold' && props.price < config.blockMinGoldSeed) return null;
  if (props.coinType === 'silver' && props.price < config.blockMinSilverSeed) return null;

  const giftItem = giftMap.get(props.giftId) || {};
  return (
    <div className="danmakuItem">
      <span className="gift-item user-name">{props.username}</span>&nbsp;{props.giftAction} {props.giftName} <img src={giftItem.gif} alt="" className="giftImg" /> x{props.giftCount}
    </div>
  );
}

function mapStateToProps(state: rootStatePropsType) {
  return {
    giftMap: state.danmaku.giftMap,
    config: state.config
  };
}

export default connect(mapStateToProps)(MsgSendGift);
