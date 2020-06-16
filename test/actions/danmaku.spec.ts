import * as actions from '../../app/actions/danmaku';

describe('actions', () => {
  it('should increment should create init websocket action', () => {
    expect(actions.CREATESOCKET).toMatchSnapshot();
  });
  it('should increment should create fetch gift data api action', () => {
    expect(actions.FETCHGIFTDATA).toMatchSnapshot();
  });
});
