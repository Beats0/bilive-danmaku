import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import DanmakuPage from '../../app/containers/DanmakuPage';
import { configureStore } from '../../app/store/configureStore';
import { danmakuStateType } from '../../app/reducers/types';
import Socket from '../../app/components/Danmaku/base/Socket';

Enzyme.configure({ adapter: new Adapter() });

const initState: danmakuStateType = {
  roomid: 292397,
  socket: new Socket(292397),
  giftMap: new Map<number, GiftRaw>(),
  userAvatarMap: new Map<number, string>()
};

function setup(initialState = { danmaku: initState }) {
  const store = configureStore(initialState);
  const history = createBrowserHistory();
  const provider = (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <DanmakuPage />
      </ConnectedRouter>
    </Provider>
  );
  const app = mount(provider);
  return {
    app,
    liveConfigContainer: app.find('.liveConfig'),
    roomIdInput: app.find('.config-input')
  };
}

describe('containers', () => {
  describe('App', () => {
    it('should display initial roomid', () => {
      const { roomIdInput } = setup();
      expect(roomIdInput.text()).toMatch(/^292397$/);
    });
  });
});
