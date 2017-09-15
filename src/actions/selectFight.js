import * as actionTypes from '../constants/actionTypes';

function setFight(fight) {
  return {
    type: actionTypes.FIGHT_SET,
    fight
  }
};

export function selectFight(fight) {
  return function(dispatch) {
    dispatch(setFight(fight))
  }
};