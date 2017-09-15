import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import fights from './fights';
import selectedEvent from './selectedEvent';
import selectedFight from './selectedFight';

export default combineReducers({
  fights,
  selectedEvent,
  selectedFight,
  routing: routerReducer
})
