import { useAppSelector } from '../../../store/hooks';
import { selectDanmaku } from '../../../store/features/danmakuSlice';
import { selectConfig } from '../../../store/features/configSlice';

function MsgSendGift(props: DanmakuGift) {
  const { ...msg } = props;
  const config = useAppSelector(selectConfig);
  const danmaku = useAppSelector(selectDanmaku);
  const { giftMap } = danmaku;
  if (config.blockEffectItem0 === 1) return null;
  if (msg.coinType === 'gold' && msg.price < config.blockMinGoldSeed)
    return null;
  if (msg.coinType === 'silver' && msg.price < config.blockMinSilverSeed)
    return null;

  const giftItem = giftMap.get(msg.giftId);
  if (giftItem) {
    return (
      <div className="danmakuItem">
        <span className="gift-item user-name">{msg.username}</span>&nbsp;
        {msg.giftAction} {msg.giftName}{' '}
        <img src={giftItem.webp} className="giftImg" /> x {msg.giftCount}
      </div>
    );
  }
  return null;
}

export default MsgSendGift;
