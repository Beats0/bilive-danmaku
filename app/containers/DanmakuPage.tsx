import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { rootStatePropsType } from '../reducers/types';
import { createSocket, fetchGiftData } from '../actions/danmaku';
import { updateConfig, fetchVersionData } from '../actions/config';
import Danmaku from '../components/Danmaku/Danmaku';

function mapStateToProps(state: rootStatePropsType) {
  return {
    roomid: state.config.roomid,
    shortid: state.config.shortid,
    socket: state.danmaku.socket,
    giftMap: state.danmaku.giftMap,
    config: state.config
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      createSocket,
      fetchGiftData,
      fetchVersionData,
      updateConfig
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Danmaku);
