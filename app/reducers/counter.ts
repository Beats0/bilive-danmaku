import { Action } from 'redux';
import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions/counter';

const initState = {
  count1: 0,
  count2: 0
}

export default function counter(state = initState, action: Action<string>) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return {...state, count1: state.count1 + 1};
    case DECREMENT_COUNTER:
      return {...state, count1: state.count1 - 1};
    default:
      return state;
  }
}
