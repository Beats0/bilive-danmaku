import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Tooltip from 'rc-tooltip';
import { animated, useSpring } from 'react-spring';
import { TFunction } from 'i18next';
import LiveRoomDao from '../../dao/LiveRoomDao';
import { getLiveRoomInfo, LiveRoom } from '../../api';
import { sortBy } from '../../utils/common';
import { rootStatePropsType } from '../../reducers/types';

interface LiveRoomListsProps {
  t: TFunction;
  currentRoomID: number;
  onChangeRoomID: (e: null, shortId: number) => void;
}

interface ListsProps extends LiveRoomListsProps {
  visible: boolean;
}

function FadeInRight({ children }) {
  const props = useSpring({
    from: {
      transform: 'translate3d(100%, 0, 0)',
      opacity: 0
    },
    to: {
      transform: 'translate3d(0, 0, 0)',
      opacity: 1
    }
  });
  return <animated.div style={props}>{children}</animated.div>;
}

function Lists(props: ListsProps) {
  const { t, currentRoomID, onChangeRoomID, visible } = props;
  const roomListsCache = LiveRoomDao.getLists();
  const [loading, setLoading] = useState(true);
  let [liveRoomLists, setLiveRoomLists] = useState<LiveRoom[]>([]);
  // const currentLiveRoomLists = useRef(liveRoomLists);

  function resetLists() {
    setLoading(true);
    liveRoomLists = [];
    setLiveRoomLists(liveRoomLists);
  }

  function handleChangeRoom(shortid: number) {
    onChangeRoomID(null, shortid);
  }

  function handleDeleteRoom(shortid: number) {
    LiveRoomDao.delete(shortid);
    setLiveRoomLists(lists => lists.filter(i => i.shortid !== shortid));
  }

  async function fetchLiveRoomData() {
    for (let i = 0; i < roomListsCache.length; i++) {
      const roomData = await getLiveRoomInfo(roomListsCache[i].roomid);
      liveRoomLists.push(roomData);
      setLiveRoomLists(lists => [...lists, roomData]);
    }
    liveRoomLists = liveRoomLists.sort(sortBy('isLive'));
    setLiveRoomLists([...liveRoomLists]);
    setLoading(false);
  }

  useEffect(() => {
    if (visible) {
      resetLists();
      fetchLiveRoomData();
    }
  }, [visible]);

  if (loading) {
    return (
      <div id="liveRoomContainer" style={{ overflow: 'hidden' }}>
        <span className="text-center">{t('LiveRoomListsLoading')}</span>
        <div className="link-progress-tv">
          <div className="loading-text">
            Loading(
            {liveRoomLists.length}
/
{roomListsCache.length}
            )...
          </div>
        </div>
      </div>
    );
  }
  return (
    <div id="liveRoomContainer" className="scrollbar">
      <FadeInRight>
        {liveRoomLists.map(i => {
          return (
            <div className="user-row" key={String(i.roomid)}>
              <div
                className="user-avatar-container"
                onClick={() => handleChangeRoom(i.shortid)}
              >
                <div
                  className="live-user-avatar"
                  style={{ backgroundImage: `url(${i.face})` }}
                />
                {i.isLive && <span className="live-status-on" />}
              </div>
              <div
                className="user-info-cntr"
                onClick={() => handleChangeRoom(i.shortid)}
              >
                <p
                  className={`user-info-name one-line-row ${i.shortid ===
                    currentRoomID && 'live-row-active'}`}
                >
                  {i.uname}
                </p>
                <p className="user-info-room-name one-line-row" title={i.title}>
                  {i.title}
                </p>
              </div>
              <span
                title={t('LiveRoomListsDelete')}
                onClick={() => handleDeleteRoom(i.shortid)}
                className="icon-item icon-font icon-error error liveIcon live-icon-item pointer"
              />
            </div>
          );
        })}
      </FadeInRight>
    </div>
  );
}

function LiveRoomLists(props: LiveRoomListsProps) {
  const { t, currentRoomID, onChangeRoomID } = props;
  const [listsVisible, setListsVisible] = useState(false);

  return (
    <Tooltip
      visible={listsVisible}
      animation="fade"
      placement="bottomRight"
      overlayClassName="liveRoomToolTip"
      align={{
        offset: [60, 5]
      }}
      onVisibleChange={() => setListsVisible(!listsVisible)}
      trigger="click"
      overlay={
        <Lists
          t={t}
          currentRoomID={currentRoomID}
          onChangeRoomID={onChangeRoomID}
          visible={listsVisible}
        />
      }
    >
      <span
        title={t('HeaderSubscribeTitle')}
        className="icon-item icon-font icon-message liveIcon pointer"
        style={{ fontSize: 17 }}
      />
    </Tooltip>
  );
}

function mapStateToProps(state: rootStatePropsType) {
  return {
    currentRoomID: state.config.shortid
  };
}

export default connect(mapStateToProps)(LiveRoomLists);
