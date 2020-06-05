import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
// import CounterPage from './containers/CounterPage';
import DanmakuPage from './containers/DanmakuPage';

export default function Routes() {
  return (
    <App>
      <Switch>
        {/* <Route path={routes.COUNTER} component={CounterPage} /> */}
        <Route path={routes.DANMAKU} component={DanmakuPage} />
      </Switch>
    </App>
  );
}
