import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';

interface DanmakuListProps {
  showGiftDanmakuList: boolean;
  height: number;
  maxMessageCount: number;
}

export interface DanmakuListRef {
  onMessage: (lists: React.ReactElement[]) => void;
  clearMessage: () => void;
}

function DanmakuList(props: DanmakuListProps, ref: React.Ref<DanmakuListRef>) {
  const { showGiftDanmakuList, height, maxMessageCount } = props;
  const maxMessageCountRef = useRef(maxMessageCount);
  maxMessageCountRef.current = maxMessageCount;
  let [direction, setDirection] = useState('down');
  let [renderDanmakuLists, setRenderDanmakuLists] = useState<
    React.ReactElement[]
  >([]);

  const onMessage = useCallback(lists => {
    renderDanmakuLists = [...renderDanmakuLists, ...lists];
    if (renderDanmakuLists.length > maxMessageCountRef.current) {
      renderDanmakuLists.splice(0, renderDanmakuLists.length - maxMessageCountRef.current);
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
    // 距离底部1/3后自动定位到底部
    if (scrollHeight - (scrollTop + clientHeight) > scrollHeight / 3) return;
    chatListEl.scrollTop = scrollHeight;
  }

  return (
    <div
      className="chat-history-list scrollbar"
      style={{
        height: showGiftDanmakuList
          ? `calc(100vh - ${height + 170}px)`
          : `calc(100vh - 125px)`
      }}
    >
      {[...renderDanmakuLists]}
    </div>
  );
}

export default forwardRef(DanmakuList);
