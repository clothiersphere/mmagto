import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter, routerREducer, routerMiddleware, push, syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import configureStore from './stores/configureStore';
import * as actions from './actions';
import App from './components/app';
import BettingPage from './components/BettingPage';
import EventList from './components/BettingPage/Body/EventList';
import FightCard from './components/BettingPage/Body/FightCard';

const store = configureStore();
// const history = syncHistoryWithStore(BrowserRouter, store);
const history = createHistory();

store.dispatch(actions.getEvents());

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={BettingPage} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('app'),
);

module.hot.accept();
