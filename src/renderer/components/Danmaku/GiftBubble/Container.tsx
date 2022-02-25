import styled from 'styled-components';
import { useTransition } from 'react-spring';
import GiftBubbleItem from './GiftBubbleItem';
import { userAvatarFilter } from '../../../utils/common';
import { ComboData } from './Provider';
import { useAppSelector } from '../../../store/hooks';
import { selectDanmaku } from '../../../store/features/danmakuSlice';

export interface GiftListsItem {
  id: number;
  ttl: number;
  comboId?: string;
  msg: DanmakuGift;
}

interface GiftContainerProps {
  lists: GiftListsItem[];
  comboMap: Map<string, ComboData | 0>;
  giftMap: Map<number, GiftRaw>;
}

const Wrapper = styled.div`
  position: absolute;
  let: 0;
  top: 0;
  z-index: 1;
`;

function Multiply(batchComboId: string, num: number) {
  if (num < 1) return <span className="number dp-i-block bg-no-repeat" />;
  const arr = num.toString().split('');
  return (
    <>
      {arr.map((i, index) => (
        <span
          className={`number dp-i-block bg-no-repeat number-${i}`}
          key={`${batchComboId}-${index}`}
        />
      ))}
    </>
  );
}

const GiftContainer = (props: GiftContainerProps) => {
  const danmaku = useAppSelector(selectDanmaku);
  const { giftMap } = danmaku;

  const { lists, comboMap } = props;
  const transitions = useTransition(lists, {
    from: { left: '-100%' },
    enter: { left: '0%' },
    leave: { left: '-100%' },
  });

  return (
    <Wrapper>
      {transitions((style, item) => {
        const { msg } = item;
        const face = userAvatarFilter(msg.face);
        const giftItem = giftMap.get(msg.giftId) || {};
        const comboData = comboMap.get(msg.batchComboId || '-1');
        const giftCount = comboData.giftCount || comboData.superGiftNum;
        const { superBatchGiftNum } = comboData;

        return (
          <GiftBubbleItem {...item} key={item.id} id={item.id} style={style}>
            <div className="base-bubble-wrapper super-gift-bubbles combo_normal">
              <div className="base-bubble p-absolute">
                <div
                  className="base-bubble-bg bg-no-repeat"
                  style={{
                    backgroundImage: `url(https://i0.hdslb.com/bfs/live/6790d6043136ad00165adf003d828d40b49bd1fa.png)`,
                  }}
                />
              </div>
              <div className="content-ctnr border-box p-relative">
                <div className="super-gift-item animation">
                  <div className="user-avatar-box dp-i-block bg-cover v-middle">
                    <div
                      className="user-avatar dp-i-block"
                      style={{ backgroundImage: `url(${face})` }}
                    />
                  </div>
                  <div className="gift-info p-relative">
                    <div className="gift-info-user-name v-middle t-over-hidden t-nowrap">
                      {msg.username}
                    </div>
                    <span className="action v-middle">{msg.giftAction}</span>
                    <span className="gift-name v-middle">{msg.giftName}</span>
                  </div>
                  <div className="gift-pic-count p-relative">
                    {/* <div className="battle-crit"> */}
                    {/*  <span className="crit-name"></span> */}
                    {/*  <span className="crit-plus"></span> */}
                    {/*  <span className="crit-num crit-num-0"></span> */}
                    {/*  <span className="crit-percent"></span> */}
                    {/* </div> */}
                    {/* 过期的礼物或没有图片的礼物不显示图片 */}
                    {giftItem.gif && (
                      <img
                        src={`${giftItem.gif}`}
                        className="giftImg"
                        style={{ width: 50, height: 50 }}
                      />
                    )}
                    {/* 不包含连击效果 count = giftCount */}
                    {/* <div className={`count-amount ${superBatchGiftNum ? 'di-i-block p-absolute' : 'dp-i-block'}`}> */}
                    {/*  <span className="multiply dp-i-block" /> */}
                    {/*  {giftCount && Multiply(giftCount)} */}
                    {/* </div> */}

                    {/* 包含连击效果: count = giftCount * superBatchGiftNum */}
                    {
                      <div className="combo-amount dp-i-block">
                        {/* <span className="combo-t dp-i-block" /> */}
                        <span className="multiply dp-i-block" />
                        {Multiply(
                          msg.batchComboId,
                          giftCount * superBatchGiftNum
                        )}
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </GiftBubbleItem>
        );
      })}
    </Wrapper>
  );
};

// function mapStateToProps(state: rootStatePropsType) {
//   return {
//     giftMap: state.danmaku.giftMap,
//     config: state.config
//   };
// }

export default GiftContainer;
