/* eslint react/jsx-props-no-spreading: off */
import { spy } from 'sinon';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Danmaku from '../../app/components/Danmaku/Danmaku';
import config from '../../app/config';

Enzyme.configure({ adapter: new Adapter() });

function setup() {
  const actions = {
    createSocket: spy(),
    fetchGiftData: spy(),
    fetchVersionData: spy(),
    updateConfig: spy()
  };
  const component = shallow(
    <Danmaku
      roomid={292397}
      shortid={292397}
      socket={config.socket}
      giftMap={new Map<number, GiftRaw>()}
      config={config}
      {...actions}
    />
  );
  return {
    component,
    actions,
    liveConfigContainer: component.find('.liveConfig'),
    roomIdInput: component.find('.config-input')
  };
}

describe('Counter component', () => {
  it('should should display roomid', () => {
    const { roomIdInput } = setup();
    expect(roomIdInput.text()).toMatch(/^292397$/);
  });
});
