import * as actionTypes from '../constants/actionTypes';

function setEvent(event) {
  return {
    type: actionTypes.FIGHTS_SET,
    event
  }
};

export function selectEvent(fight) {
  return function(dispatch) {
    dispatch(setEvent(fight))
  }
};