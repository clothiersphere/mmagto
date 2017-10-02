import * as actionTypes from '../constants/actionTypes';

function setFighter(fighter) {
  return {
    type: actionTypes.FIGHTER_SET,
    fighter
  }
};

export function selectFighter(fighter) {
  return function(dispatch) {
    dispatch(setFighter(fighter))
  }
};
