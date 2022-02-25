import { useAppSelector } from '../../../store/hooks';
import { selectConfig } from '../../../store/features/configSlice';

interface VipProps {
  isVip: boolean;
  isVipM: boolean;
  isVipY: boolean;
}

function MsgVip(vip: VipProps) {
  const config = useAppSelector(selectConfig);
  if (config.showVip === 0 || !vip.isVip) return null;
  if (vip.isVipY) {
    return <span className="vip-year">爷</span>;
  }
  if (vip.isVipM) {
    return <span className="vip-mouth">爷</span>;
  }
  return null;
}

export default MsgVip;
