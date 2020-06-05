import React, { useCallback, useContext, useState } from 'react';
import SuperChatContainer, { GiftListsItem } from './Container';
import { sortBy, unionSet } from '../../../utils/common';

const SuperChatContext = React.createContext(null);

export interface ComboData {
  giftCount?: number;
  superGiftNum?: number;
  superBatchGiftNum?: number;
}

let id = 1;
const comboMap = new Map<string, ComboData | 0>();
// 初始化为0
comboMap.set('-1', 0);

const updateMap = (comboId: string, msg: DanmakuGift) => {
  comboMap.set(comboId, msg);
  // if (msg.superGiftNum) {
  //   comboMap.set(comboId, { superGiftNum: msg.superGiftNum });
  // } else {
  //   comboMap.set(comboId, { giftCount: msg.giftCount });
  // }
};

const ListProvider = ({ children }: { children: React.ReactNode }) => {
  const [lists, setLists] = useState<GiftListsItem[]>([]);

  // FIXME: 大量添加会造成阻塞，速度过快添加不了
  const addItem = useCallback(
    (msg: DanmakuGift, ttl: number) => {
      setLists(lists => {
        const comboId = msg.batchComboId;
        // combo连击增加
        if (comboId) {
          updateMap(comboId, msg);
        }
        let newLists = [
          ...lists,
          {
            id: id++,
            ttl,
            comboId,
            msg
          }
        ].sort(sortBy('price', false, 'msg'));
        newLists = unionSet(newLists, 'comboId');
        // 最多只显示3个
        if (newLists.length > 3) {
          removeItem(newLists[0].id);
          // newLists.splice(0, 1);
        }
        return newLists;
      });
    },
    [setLists]
  );

  const updateItem = useCallback(
    (msg: GiftSend, ttl: number, comboId: string) => {
      setLists(lists => {
        //   const newLists = [
        //     ...lists,
        //     {
        //       id: id++,
        //       ttl,
        //       msg
        //     }
        //   ].sort(sortBy('price', false, 'msg'));
        //   if (newLists.length > 3) {
        //     removeItem(newLists[0].id);
        //     // newLists.splice(0, 1);
        //   }
        //   return newLists;
        // comboMap.set(msg.batchComboId, msg.comboNum);
        updateMap(msg.batchComboId, msg);

        lists.map(item => {
          if (item.comboId === comboId) {
            item.msg.giftCount = msg.comboNum;
            return item;
          }
        });
        console.log('handle update update', msg, lists);
        return lists;
      });
    },
    [setLists]
  );

  const removeItem = useCallback(
    (id: number) => {
      setLists(lists => {
        const newLists = lists.filter(t => t.id !== id);
        return newLists;
      });
    },
    [setLists]
  );

  return (
    <SuperChatContext.Provider
      value={{
        addItem,
        updateItem,
        removeItem
      }}
    >
      <SuperChatContainer lists={lists} comboMap={comboMap} />
      {children}
    </SuperChatContext.Provider>
  );
};

const useList = () => {
  return useContext(SuperChatContext);
};

export { SuperChatContext, useList };
export default ListProvider;
