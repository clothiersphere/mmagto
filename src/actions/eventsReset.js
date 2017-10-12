import * as actionTypes from '../constants/actionTypes';

// function resetEvents(event) {
//   return {
//     type: actionTypes.EVENTS_RESET,
//     event
//   };
// };

export function eventsReset() {
  return function(dispatch) {
    dispatch({type: 'FIGHT_RESET'})
    dispatch({type: 'FIGHTER_RESET'})
    dispatch({type: 'EVENTS_RESET'})
  };
};