import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Counter from '../components/Counter/Counter';
import {
  increment,
  decrement,
  incrementIfOdd,
  incrementAsync
} from '../actions/counter';
import { updateConfig } from '../actions/config';
import { rootStatePropsType } from '../reducers/types';

function mapStateToProps(state: rootStatePropsType) {
  return {
    count1: state.counter.count1
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      increment,
      decrement,
      incrementIfOdd,
      incrementAsync,
      updateConfig
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
