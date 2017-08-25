import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import fights from './fights';
import selectedEvent from './selectedEvent';

export default combineReducers({
  fights,
  selectedEvent,
  routing: routerReducer
})
