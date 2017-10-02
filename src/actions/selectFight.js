import * as actionTypes from '../constants/actionTypes';

function setFight(fight) {
  return {
    type: actionTypes.FIGHT_SET,
    fight
  };
};

function resetFight() {
  return {
    type: actionTypes.FIGHT_RESET,

  }
}

export function selectFight(fight) {
  return function(dispatch) {
    dispatch({type: 'FIGHTER_RESET'})
    dispatch(setFight(fight))
  };
};''
