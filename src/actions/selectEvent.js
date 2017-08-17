import * as actionTypes from '../constants/actionTypes';

function selectEvent(event) {
  return {
    type: actionTypes.FIGHTS_SET,
    event
  };
};

export default selectEvent;

