import React, { useEffect, useState, useRef } from 'react';
import Tooltip from 'rc-tooltip';
import { useList } from './Provider';
import MsgSuperChatCard from '../MsgEntity/MsgSuperChatCard';

export interface SuperChatItemProps {
  id: number;
  ttl: number;
  msg: SUPER_CHAT_MESSAGE_DATA;
}

const SuperChatItem = ({ id, ttl, msg }: SuperChatItemProps) => {
  // timer = ttl(总时长) - (end_time - ts)已过期时长
  const [timer, setTimer] = useState(ttl - (msg.ts - msg.start_time));
  const { removeItem } = useList();
  const [showDetail, setShowDetail] = useState(false);
  const intervalRef = useRef();

  const active = () => {
    if (timer > 0) {
      const timerId = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
      intervalRef.current = timerId;
    }
  };

  const destroy = () => {
    clearInterval(intervalRef.current);
    if (timer === 1) {
      removeItem(id);
    }
  };

  useEffect(() => {
    active();
    return () => destroy();
  }, [id, removeItem, ttl, timer]);

  const w = Math.floor((timer / ttl) * 100);

  return (
    <Tooltip
      visible={showDetail}
      overlayClassName="full"
      animation="fade"
      placement="bottom"
      onVisibleChange={() => setShowDetail(!showDetail)}
      trigger="click"
      overlay={<MsgSuperChatCard msg={msg} />}
    >
      <div
        className="card-item-box child active"
        style={{ borderColor: 'transparent' }}
      >
        <div className="card-item">
          <div
            className="totle"
            style={{ backgroundColor: msg.background_price_color }}
          />
          <div
            className="progress"
            style={{ backgroundColor: msg.background_bottom_color, width: `${w}%` }}
          />
          <div
            className="face-img"
            style={{
              backgroundImage: `url(${msg.user_info.face})`
            }}
          />
          <div title={`￥${msg.price}`} className="price">
            ￥{msg.price}
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

export default SuperChatItem;
