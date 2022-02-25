import { useTranslation } from 'react-i18next';

export default function MsgGuardBuy(props: GuardBuyMsg) {
  const { ...msg } = props;
  const { t } = useTranslation();

  return (
    <div className="chat-item system-msg guard-buy border-box">
      <span
        className={`guard-icon msg-icon level-${msg.guardLevel} dp-i-block v-bottom`}
        role="img"
      />
      <div className="msg-content p-relative" style={{ color: '#EF903A' }}>
        <span>
          <span style={{ color: '#D54900' }} className="v-middle">
            {msg.username}
          </span>
          <span style={{ color: '#EF903A' }} className="v-middle">
            {t('DanmakuGuardBuyInRoom')}
            {msg.giftName}
          </span>
        </span>
      </div>
    </div>
  );
}
