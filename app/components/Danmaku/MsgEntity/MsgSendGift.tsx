import React from 'react';
import { connect } from 'react-redux';
import { rootStatePropsType } from '../../../reducers/types';

interface GiftProps extends DanmakuGift {
  config: ConfigStateType;
  giftMap: Map<number, GiftRaw>;
}

function MsgSendGift(props: GiftProps) {
  const { giftMap, config, ...msg } = props;
  if (config.blockEffectItem0 === 1) return null;
  if (msg.coinType === 'gold' && msg.price < config.blockMinGoldSeed) return null;
  if (msg.coinType === 'silver' && msg.price < config.blockMinSilverSeed) return null;

  const giftItem = giftMap.get(msg.giftId) || {};
  return (
    <div className="danmakuItem">
      <span className="gift-item user-name">{msg.username}</span>&nbsp;{msg.giftAction} {msg.giftName} <img src={giftItem.gif} alt="" className="giftImg" /> x{msg.giftCount}
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
