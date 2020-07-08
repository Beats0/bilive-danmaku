import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef
} from 'react';
import { updateConfig } from '../../../actions/config';
import { ConfigKey } from '../../../reducers/types';

const minListHeight = 10;
const maxListHeight = 400;

type Props = {
  showGiftDanmakuList: boolean;
  height: ConfigStateType;
  maxGiftCount: number;
  updateConfig: typeof updateConfig;
};

export interface DanmakuGiftListRef {
  onMessage: (lists: React.ReactElement[]) => void;
}

function DanmakuGiftList(props: Props, ref: React.Ref<DanmakuGiftListRef>) {
  const { showGiftDanmakuList, height, maxGiftCount, updateConfig } = props;
  let [direction, setDirection] = useState('down');
  const [state, setState] = useState({
    isDragging: false,
    height,
    top: 0,
    original_height: 0,
    original_y: 0,
    original_mouse_y: 0
  });
  const currentState = useRef(state);
  currentState.current = state;

  let [renderDanmakuGiftLists, setRenderDanmakuGiftLists] = useState<
    React.ReactElement[]
  >([]);

  const onMessage = useCallback(lists => {
    renderDanmakuGiftLists = [...renderDanmakuGiftLists, ...lists];
    if (renderDanmakuGiftLists.length > maxGiftCount) {
      renderDanmakuGiftLists.splice(
        0,
        renderDanmakuGiftLists.length - maxGiftCount
      );
    }
    setRenderDanmakuGiftLists([...renderDanmakuGiftLists]);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      onMessage
    }),
    [onMessage]
  );

  const handleMouseMove = useCallback(
    ({ clientY }) => {
      if (state.isDragging) {
        const height =
          state.original_height - (clientY - state.original_mouse_y);
        if (height > minListHeight && height < maxListHeight) {
          setState(prevState => ({
            ...prevState,
            height,
            top: state.original_y + (clientY - state.original_mouse_y)
          }));
        }
      }
    },
    [state.isDragging]
  );

  const handleMouseUp = useCallback(() => {
    document.body.style.setProperty('user-select', 'auto');
    if (state.isDragging) {
      setState(prevState => ({
        ...prevState,
        isDragging: false
      }));
      updateConfig({
        k: ConfigKey.danmakuGiftListHeight,
        v: currentState.current.height
      });
    }
  }, [state.isDragging]);

  const handleMouseDown = useCallback(({ clientY }) => {
    // 移动时禁止user-select，防止选中文本导致Mouse事件失效
    document.body.style.setProperty('user-select', 'none');
    const danmakuGiftContainerEl = document.querySelector(
      '.danmakuGiftContainer'
    );
    setState(prevState => ({
      ...prevState,
      isDragging: true,
      original_height: danmakuGiftContainerEl
        ? parseFloat(
            getComputedStyle(danmakuGiftContainerEl, null)
              .getPropertyValue('height')
              .replace('px', '')
          )
        : 0,
      original_y: danmakuGiftContainerEl
        ? danmakuGiftContainerEl.getBoundingClientRect().top
        : 0,
      original_mouse_y: clientY
    }));
  }, []);

  const handleScroll = () => {
    const danmakuGiftContainerEl = document.querySelector(
      '.danmakuGiftContainer'
    );
    if (!danmakuGiftContainerEl) return;
    danmakuGiftContainerEl.addEventListener('mousewheel', e => {
      direction = e.deltaY > 0 ? 'down' : 'up';
      setDirection(direction);
    });
  };

  const blockScrollBar = () => {
    const danmakuGiftContainerEl = document.querySelector(
      '.danmakuGiftContainer'
    );
    if (!danmakuGiftContainerEl) return;
    const { scrollHeight, scrollTop, clientHeight } = danmakuGiftContainerEl;
    if (direction === 'up') return;
    // 距离底部1/2后自动定位到底部
    if (scrollHeight - (scrollTop + clientHeight) > scrollHeight / 2) return;
    danmakuGiftContainerEl.scrollTop = scrollHeight;
  };

  useEffect(() => {
    handleScroll();
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    blockScrollBar();
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, renderDanmakuGiftLists]);

  if (!showGiftDanmakuList) return null;

  return (
    <div className="danmakuGiftOuter">
      <div onMouseDown={handleMouseDown} className="danmakuGiftSlider">
        <span className="slider-inner" />
      </div>
      <div
        className="danmakuGiftContainer scrollbar"
        style={{ height: state.height }}
      >
        {[...renderDanmakuGiftLists]}
      </div>
    </div>
  );
}

export default forwardRef(DanmakuGiftList);
