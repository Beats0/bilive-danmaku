import React, { forwardRef, useCallback, useImperativeHandle } from 'react';
import { useList } from './Provider';

export interface SuperChatEntityProps {
  onMessage: (msg: SUPER_CHAT_MESSAGE_DATA) => void;
  clearMessage: () => void;
}

const ListEntity = (props, ref: React.Ref<SuperChatEntityProps>) => {
  const { addItem, clear } = useList();

  const onMessage = useCallback(
    (msg: SUPER_CHAT_MESSAGE_DATA) => {
      handleAddItem(msg);
    },
    [addItem]
  );

  const clearMessage = useCallback(
    () => {
      clear();
    },
    [clear]
  );

  useImperativeHandle(
    ref,
    () => ({
      onMessage,
      clearMessage
    }),
    [onMessage, clearMessage]
  );

  const handleAddItem = (msg: SUPER_CHAT_MESSAGE_DATA) => {
    // 总时长
    const ttl = msg.end_time - msg.start_time;
    addItem(msg, ttl);
  };
};

export default forwardRef(ListEntity);
