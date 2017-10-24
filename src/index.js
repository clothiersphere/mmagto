import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import configureStore from './stores/configureStore';
import * as actions from './actions';
import App from './components/App';
import BettingPage from './components/BettingPage';
import FightCard from './components/BettingPage/Body/FightCard';

const title = 'MMA - guess the odds';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

store.dispatch(actions.getEvents());

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={BettingPage} />
        <Route path="/" component={BettingPage} />
        <Route path="fightCard" component={FightCard} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);

module.hot.accept();