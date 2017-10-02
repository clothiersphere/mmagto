import * as actionTypes from '../constants/actionTypes';

function setEvent(event) {
  return {
    type: actionTypes.FIGHTS_SET,
    event
  }
};

export function selectEvent(fight) {
  return function(dispatch) {
    dispatch({type: 'FIGHT_RESET'})
    dispatch({type: 'FIGHTER_RESET'})
    dispatch(setEvent(fight))
  }
};