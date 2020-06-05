import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';

interface DanmakuListProps {
  maxMessageCount: number;
}

function DanmakuList(props: DanmakuListProps, ref) {
  const { maxMessageCount } = props;
  let [direction, setDirection] = useState('down');
  let [renderDanmakuLists, setRenderDanmakuLists] = useState([]);

  const onMessage = useCallback(lists => {
    renderDanmakuLists = [...renderDanmakuLists, ...lists];
    if (renderDanmakuLists.length > maxMessageCount) {
      renderDanmakuLists.splice(0, renderDanmakuLists.length - maxMessageCount);
    }
    setRenderDanmakuLists([...renderDanmakuLists]);
  }, []);

  const clearMessage = useCallback(() => {
    renderDanmakuLists = [];
    setRenderDanmakuLists(renderDanmakuLists);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      onMessage,
      clearMessage
    }),
    [onMessage, clearMessage]
  );

  const handleScroll = () => {
    const chatListEl = document.querySelector('.chat-history-list');
    if (!chatListEl) return;
    chatListEl.addEventListener('mousewheel', e => {
      direction = e.deltaY > 0 ? 'down' : 'up';
      setDirection(direction);
    });
  };

  useEffect(() => {
    handleScroll();
  }, []);

  useEffect(() => {
    blockScrollBar();
  }, [renderDanmakuLists]);

  function blockScrollBar() {
    const chatListEl = document.querySelector('.chat-history-list');
    if (!chatListEl) return;
    const { scrollHeight, scrollTop, clientHeight } = chatListEl;
    if (direction === 'up') return;
    // 距离底部1/4后自动定位到底部
    if (scrollHeight - (scrollTop + clientHeight) > scrollHeight / 4) return;
    chatListEl.scrollTop = scrollHeight;
  }

  return (
    <div className="chat-history-list scrollbar">
      {[...renderDanmakuLists]}
    </div>
  );
}

export default forwardRef(DanmakuList);
