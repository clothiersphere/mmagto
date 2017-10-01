import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import fights from './fights';
import selectedEvent from './selectedEvent';
import selectedFight from './selectedFight';
import selectedFighter from './selectedFighter';

export default combineReducers({
  fights,
  selectedEvent,
  selectedFight,
  selectedFighter,
  routing: routerReducer
})
