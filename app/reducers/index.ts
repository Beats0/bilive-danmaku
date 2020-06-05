import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import counter from './counter';
import danmaku from './danmaku';
import config from './config';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    danmaku,
    counter,
    config
  });
}
