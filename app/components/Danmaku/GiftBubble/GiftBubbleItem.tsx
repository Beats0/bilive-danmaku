import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { animated } from 'react-spring';
import { useList } from './Provider';
import { DanmakuSuperChat } from '../MsgModel';

export interface SuperChatItemProps {
  id: number;
  ttl: number;
  msg: DanmakuSuperChat;
  config: ConfigStateType;
}

const Wrapper = styled(animated.div)`
  padding: 16px 16px 16px 0;
  margin-bottom: 16px;
  width: 288px;
  position: relative;
`;

const GiftBubbleItem = ({ children, id, ttl, style }: SuperChatItemProps) => {
  const [timer, setTimer] = useState(ttl);
  const { removeItem } = useList();
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
    // console.log('timer=>', timer)
    active();
    return () => destroy();
  }, [id, removeItem, ttl, timer]);

  return <Wrapper style={style}>{children}</Wrapper>;
};

export default GiftBubbleItem;
