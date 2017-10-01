import * as actionTypes from '../constants/actionTypes';

function setFighter(fighter) {
  return {
    type: actionTypes.FIGHTER_SET,
    fighter
  }
};

export function selectFighter(fighter) {
  console.log(fighter, "fighter")
  return function(dispatch) {
    dispatch(setFighter(fighter))
  }
};
