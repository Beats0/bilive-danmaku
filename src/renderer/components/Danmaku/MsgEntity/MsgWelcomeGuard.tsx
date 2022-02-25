import { useAppSelector } from "../../../store/hooks";
import { selectConfig } from "../../../store/features/configSlice";
import { useTranslation } from "react-i18next";


function MsgWelcomeGuard(props: MsgWelcomeGuard) {
  const { ...msg } = props;
  const config = useAppSelector(selectConfig);
  const { t } = useTranslation();
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

export default MsgWelcomeGuard;
