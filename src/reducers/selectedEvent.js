import * as actionTypes from '../constants/actionTypes';

const initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FIGHTS_SET:
      return setFights(state, action);
  }
  return state;
}

function setFights(state, action) {
  const { event } = action;
  return event;
}
