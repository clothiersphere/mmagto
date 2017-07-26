import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import configureStore from './stores/configureStore';
import * as actions from './actions';
import App from './components/App';
import BettingPage from './components/BettingPage';

const title = 'MMA - guess the odds';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

store.dispatch(actions.getOdds());

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={BettingPage} />
        <Route path="/" component={BettingPage} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);

module.hot.accept();