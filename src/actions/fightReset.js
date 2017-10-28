import * as actionTypes from '../constants/actionTypes';

export function fightReset() {
  return function(dispatch) {
    dispatch({type: 'FIGHT_RESET'})
  };
};