import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import odds from './odds';

export default combineReducers({
  odds,
  routing: routerReducer
})
