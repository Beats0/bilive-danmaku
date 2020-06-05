import React from 'react';
import SuperChatItem from './SuperChatItem';

const SuperChatContainer = ({ lists }) => {
  return (
    <>
      {lists.map(item => {
        return <SuperChatItem {...item} key={item.id} />;
      })}
    </>
  );
};

export default SuperChatContainer;
