import React, { useState, useContext, useCallback } from 'react';
import SuperChatContainer from './Container';
import { sortBy } from '../../../utils/common';

const SuperChatContext = React.createContext(null);

let id = 1;

const ListProvider = ({ children, removeItemCb }) => {
  let [lists, setLists] = useState([]);

  const addItem = useCallback(
    (msg, ttl) => {
      setLists(lists => [
        ...lists,
        {
          id: id++,
          ttl,
          msg
        }
      ].sort(sortBy('price', false, 'msg')));
    },
    [setLists]
  );

  const removeItem = useCallback(
    (id: number) => {
      setLists(lists => {
        const newLists = lists.filter(t => t.id !== id)
        removeItemCb(newLists);
        return newLists;
      });
    },
    [setLists]
  );

  const clear = useCallback(
    () => {
      setLists([]);
    },
    [setLists]
  );

  return (
    <SuperChatContext.Provider
      value={{
        addItem,
        removeItem,
        clear
      }}
    >
      <SuperChatContainer lists={lists} />
      {children}
    </SuperChatContext.Provider>
  );
};

const useList = () => {
  const listHelpers = useContext(SuperChatContext);
  return listHelpers;
};

export { SuperChatContext, useList };
export default ListProvider;
