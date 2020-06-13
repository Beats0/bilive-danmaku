import React, { forwardRef, useCallback, useImperativeHandle } from 'react';
import { useList } from './Provider';
import { CmdType } from '../MsgModel';

export interface GiftBubbleEntityRef {
  onMessage: () => void;
}

const defaultTtl = 1;

const ListEntity = (props, ref: React.Ref<GiftBubbleEntityRef>) => {
  const { addItem, updateItem } = useList();

  const onMessage = useCallback(
    (msg: SEND_GIFT | COMBO_SEND | COMBO_END) => {
      // console.log('onMessage', msg);
      if (msg.cmd === CmdType.SEND_GIFT) {
        handleAddItem(msg);
      } else if (msg.cmd === CmdType.COMBO_SEND) {
        handleUpdateItem(msg);
      }
    },
    [addItem, updateItem]
  );

  useImperativeHandle(
    ref,
    () => ({
      onMessage
    }),
    [onMessage]
  );

  const handleAddItem = (msg: GiftBubbleMsg) => {
    const ttl = defaultTtl + msg.comboStayTime;
    addItem(msg, ttl);
  };

  // TODO: handleUpdateItem
  const handleUpdateItem = (msg: GiftBubbleMsg) => {
    const ttl = defaultTtl + msg.comboStayTime;
    updateItem(msg, ttl);
  };
};

export default forwardRef(ListEntity);
