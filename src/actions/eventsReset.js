import * as actionTypes from '../constants/actionTypes';

export function eventsReset() {
  return function(dispatch) {
    dispatch({type: 'FIGHT_RESET'})
    dispatch({type: 'FIGHTER_RESET'})
    dispatch({type: 'EVENTS_RESET'})
  };
};