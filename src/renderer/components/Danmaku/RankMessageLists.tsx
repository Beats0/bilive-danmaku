import { useEffect, useState } from "react";
import Tooltip from "rc-tooltip";
import { animated, useSpring } from "react-spring";
import { useTranslation } from "react-i18next";
import { getRankMessageList, RankMessageListsItem } from "../../api";
import { useAppSelector } from "../../store/hooks";
import { selectConfig } from "../../store/features/configSlice";
import { dateFormat, openLink } from "../../utils/common";

interface ListsProps {
  visible: boolean;
}

function FadeInRight({ children }) {
  const props = useSpring({
    from: {
      transform: 'translate3d(100%, 0, 0)',
      opacity: 0,
    },
    to: {
      transform: 'translate3d(0, 0, 0)',
      opacity: 1,
    },
  });
  return <animated.div style={props}>{children}</animated.div>;
}

function Lists(props: ListsProps) {
  const { visible } = props;
  const { t } = useTranslation();
  const config = useAppSelector(selectConfig);
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState<RankMessageListsItem[]>([]);

  function resetLists() {
    setLoading(true);
    setLists([]);
  }

  async function fetchRankMessageListData() {
    const messageListsData = await getRankMessageList(config.roomid);
    setLists(messageListsData);
    setLoading(false);
  }

  useEffect(() => {
    if (visible) {
      resetLists();
      fetchRankMessageListData();
    }
  }, [visible]);

  if (loading) {
    return (
      <div id="liveRoomContainer" style={{ overflow: 'hidden' }}>
        <span className="text-center">{t('RankMessageList')}</span>
        <div className="link-progress-tv">
          <div className="loading-text">
            Loading...
          </div>
        </div>
      </div>
    );
  }
  if (lists.length === 0) {
    return (
      <div id="liveRoomContainer" style={{ overflow: 'hidden' }}>
        <span className="text-center">{t('RankMessageList')}</span>
        <div className="link-no-data" />
      </div>
    );
  }
  return (
    <div id="liveRoomContainer" className="scrollbar">
      <FadeInRight>
        {
          lists.map((i, index) => {
            return (
              <div className="message-item" key={ String(i.send_time) }>
                <div className="message-item-info">
                  {
                    index <= 2
                      ? <div className="rank-icon special cus-rank-icon" style={{backgroundImage: `url(${i.ranked_icon})` }} />
                      : <div className="rank-icon cus-rank-icon"><span className="num">{index+1}</span></div>
                  }
                  <div className="user-avatar cursor" onClick={() => openLink(`https://space.bilibili.com/${i.uid}`)}>
                    <span className="avatar" style={{ backgroundImage: `url(${i.face}@60w_60h.webp)` }} />
                    <span className="pendant" style={{ backgroundImage: `url(${i.face_frame}@80w_80h.webp)` }} />
                  </div>
                  <div className="user-info">
                    <p title={i.uname} className="user-name cursor" onClick={() => openLink(`https://space.bilibili.com/${i.uid}`)}>{i.uname}</p>
                    <p className="publish-date">{dateFormat(new Date(i.send_time * 1000), 'HH:MM:SS')}</p>
                  </div>
                  <div className="amount"><span className="consumption">¥ {i.price}</span></div>
                </div>
                <div className="message-item-context">{i.message}</div>
                <div className="hr-line" />
              </div>
            );
          })
        }
      </FadeInRight>
    </div>
  );
}

function RankMessageLists() {
  const { t } = useTranslation();
  const [listsVisible, setListsVisible] = useState(false);

  return (
    <Tooltip
      visible={listsVisible}
      animation="fade"
      placement="bottomRight"
      overlayClassName="rankMessageToolTip"
      align={{
        offset: [60, 5],
      }}
      onVisibleChange={() => setListsVisible(!listsVisible)}
      trigger="click"
      overlay={<Lists visible={listsVisible} />}
    >
      <span
        title={t('RankMessageList')}
        style={{ fontSize: 17 }}
        className="icon-item icon-font icon-comment liveIcon pointer"
      />
    </Tooltip>
  );
}

export default RankMessageLists;
