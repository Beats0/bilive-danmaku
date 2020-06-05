import React, {
  forwardRef,
  useImperativeHandle,
  useCallback,
  useRef,
  useState
} from 'react';
import ListProvider from './Provider';
import SuperChatEntity from './SuperChatEntity';
import { SuperChatItemProps } from './SuperChatItem';

function SuperChatPanel(props, ref: React.Ref<any>) {
  const [lists, setLists] = useState<SuperChatItemProps[]>([]);
  const [prevVisible, setPrevVisible] = useState<boolean>(false);
  const [nextVisible, setNextVisible] = useState<boolean>(false);
  const scEntityRef = useRef({});
  const sliderRef = useRef(null);
  const offsetWidthValue = sliderRef.current ? sliderRef.current.offsetWidth : 0;
  const scrollWidthValue = sliderRef.current ? sliderRef.current.scrollWidth : 0;

  const onMessage = useCallback(
    msg => {
      lists.push(msg);
      setLists([...lists]);
      onScEntityMessage(msg);
      showSliderBtn(sliderRef.current.offsetWidth, sliderRef.current.scrollWidth)
    },
    []
  );

  const onClearMessage = useCallback(
    () => {
      clearMessage()
    }, []
  )

  const onScEntityMessage = useCallback((msg) => {
    scEntityRef.current.onMessage && scEntityRef.current.onMessage(msg);
  }, []);

  const clearMessage = useCallback(() => {
    scEntityRef.current.clearMessage && scEntityRef.current.clearMessage();
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      onMessage,
      onClearMessage
    }),
    [onMessage, onClearMessage]
  );

  const removeItemCb = (lists: SuperChatItemProps[]) => {
    setLists(lists);
    showSliderBtn(sliderRef.current.offsetWidth, sliderRef.current.scrollWidth);
  };

  const showSliderBtn = (offsetWidthValue, scrollWidthValue) => {
    setPrevVisible(sliderRef.current.scrollLeft > 0);
    setNextVisible(sliderRef.current.scrollLeft + offsetWidthValue < scrollWidthValue)
  };

  const handleArrowClick = (position: string) => {
    const el = sliderRef.current;
    if(position === 'left') {
      el.scrollLeft -= offsetWidthValue / 2;
    } else {
      el.scrollLeft += offsetWidthValue / 2;
    }
    showSliderBtn(offsetWidthValue, scrollWidthValue);
  };

  return (
    <div className="pay-note-panel-vm">
      <div ref={sliderRef} className="pay-note-panel">
        <div className="card-list">
          <ListProvider removeItemCb={removeItemCb}>
            <SuperChatEntity ref={scEntityRef} />
          </ListProvider>
        </div>
        <div className={`arrow-left ${!prevVisible && 'hidden'}`} onClick={() => handleArrowClick('left')} />
        <div className={`arrow-right ${!nextVisible && 'hidden'}`} onClick={() => handleArrowClick('right')} />
      </div>
    </div>
  );
}

export default forwardRef(SuperChatPanel);
