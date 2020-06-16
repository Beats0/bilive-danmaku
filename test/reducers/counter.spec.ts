import counter from '../../app/reducers/counter';
import {
  INCREMENT_COUNTER,
  DECREMENT_COUNTER
} from '../../app/actions/counter';

describe('reducers', () => {
  describe('counter', () => {
    it('should handle initial state', () => {
      expect(counter({ count1: 0, count2: 0 }, {})).toMatchSnapshot();
    });

    it('should handle INCREMENT_COUNTER', () => {
      expect(
        counter({ count1: 0, count2: 0 }, { type: INCREMENT_COUNTER })
      ).toMatchSnapshot();
    });

    it('should handle DECREMENT_COUNTER', () => {
      expect(
        counter({ count1: 1, count2: 0 }, { type: DECREMENT_COUNTER })
      ).toMatchSnapshot();
    });

    it('should handle unknown action type', () => {
      expect(
        counter({ count1: 0, count2: 0 }, { type: 'unknown' })
      ).toMatchSnapshot();
    });
  });
});
