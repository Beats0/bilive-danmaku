import danmaku from '../../app/reducers/danmaku';
import { CREATESOCKET, FETCHGIFTDATA } from '../../app/actions/danmaku';
import { danmakuStateType } from '../../app/reducers/types';
import Socket from '../../app/components/Danmaku/base/Socket';

describe('reducers', () => {
  describe('danmaku', () => {
    const initState: danmakuStateType = {
      roomid: 292397,
      socket: new Socket(292397),
      giftMap: new Map<number, GiftRaw>(),
      userAvatarMap: new Map<number, string>()
    };

    it('should handle initial state', () => {
      expect(danmaku(initState, {})).toMatchSnapshot();
    });

    it('should handle CREATESOCKET', () => {
      expect(
        danmaku(initState, {
          type: CREATESOCKET,
          payload: { roomid: 292397 }
        })
      ).toMatchSnapshot();
    });

    it('should handle FETCHGIFTDATA', () => {
      expect(
        danmaku(initState, {
          type: FETCHGIFTDATA,
          payload: { giftMap: new Map<number, GiftRaw>() }
        })
      ).toMatchSnapshot();
    });
  });
});
