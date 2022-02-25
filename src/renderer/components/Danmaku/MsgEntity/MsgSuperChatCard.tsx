import { CSSProperties, useState } from 'react';
import { currentTranslateToCode, translate } from '../../../utils/translation';
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../store/hooks";
import { selectConfig } from "../../../store/features/configSlice";

interface SuperChatCardProps {
  msg: SUPER_CHAT_MESSAGE_DATA;
  style?: CSSProperties;
}

function MsgSuperChatCard(props: SuperChatCardProps) {
  const { msg, style } = props;
  const { t } = useTranslation();
  const config = useAppSelector(selectConfig);

  let [translateContent, setTranslateContent] = useState(msg.message);

  const handleTranslate = () => {
    translate(msg.message, {
      from: 'auto',
      to: currentTranslateToCode()
    })
      .then(translateObj => {
        translateContent = `${ msg.message }(${ translateObj.text })`;
        setTranslateContent(translateContent);
      })
      .catch((e: any) => {
        console.log(e);
        translateContent = `${ msg.message }(${t('TranslateFailed')})`;
        setTranslateContent(translateContent);
      });
  };

  if (config.blockEffectItem3 === 1) return null;

  return (
    <div className="detail-info" style={style}>
      <div className="card-detail">
        <div
          className="card-item-middle-top"
          style={{
            border: `1px solid ${msg.background_bottom_color}`,
            backgroundImage: `url(${msg.background_image})`,
            backgroundColor: msg.background_color
          }}
        >
          <div className="card-item-middle-top-left">
            <div
              className="icon-face"
              style={{
                backgroundImage: `url(${msg.user_info.face})`
              }}
            />
            <div
              className="icon-face-frame"
              style={{
                backgroundImage: `url(${msg.user_info.face_frame})`
              }}
            />
          </div>
          <div className="card-item-middle-top-right">
            <div className="name isVip">{msg.user_info.uname}</div>
            <div className="content-bottom">
              <div className="price">
                ￥{msg.price}
                <span className="exp">（{Math.floor(msg.price / 10)}万金瓜子）</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="card-item-middle-bottom"
          style={{ backgroundColor: msg.background_bottom_color }}
        >
          <div className="input-contain">
            <span className="text"> {translateContent}</span>
            <span title="翻译" onClick={handleTranslate} className="icon-item icon-font icon-replace translateIcon" />
          </div>
          {
            !!msg.message_trans && (
              <div className="input-trans-contain">
                <span className="text"> {msg.message_trans}</span>
              </div>
            )
          }
          <div
            className="bottom-background"
            style={{
              backgroundImage: `url(https://i0.hdslb.com/bfs/live/e12e931ed8d9e5189ab6d1a3a1da35af4f8a55af.png)`
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default MsgSuperChatCard;
