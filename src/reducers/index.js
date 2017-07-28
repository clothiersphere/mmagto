import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import fights from './fights';

export default combineReducers({
  fights,
  routing: routerReducer
})
