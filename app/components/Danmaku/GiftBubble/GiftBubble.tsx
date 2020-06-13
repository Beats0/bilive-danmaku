import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import ListProvider from './Provider';
import GiftBubbleEntity, { GiftBubbleEntityRef } from './GiftBubbleEntity';

export interface GiftBubbleRef {
  onMessage: (msg: GiftBubbleMsg) => void;
}

function GiftBubble(props, ref: React.Ref<GiftBubbleRef>) {
  const [lists, setLists] = useState([]);
  const giftRef = useRef<GiftBubbleEntityRef>(null);

  const onMessage = useCallback(
    (msg: GiftBubbleMsg) => {
      lists.push(msg);
      setLists([...lists]);
      onGiftBubbleMessage(msg);
    },
    []
  );

  const onGiftBubbleMessage = useCallback((msg: GiftBubbleMsg) => {
    giftRef.current.onMessage && giftRef.current.onMessage(msg);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      onMessage
    }),
    [onMessage]
  );

  return (
    <div id="chat-gift-bubble-vm" className="gift-bubble-setting">
      <div className="bubble-list">
        <ListProvider>
          <GiftBubbleEntity ref={giftRef} />
        </ListProvider>
      </div>
    </div>
  );
}

export default forwardRef(GiftBubble);
