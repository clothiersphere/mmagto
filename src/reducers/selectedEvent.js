import * as actionTypes from '../constants/actionTypes';

const initialState = [];

function setFights(state, action) {
  const { event } = action;
  return [...state, event];
}

export default function (state = initialState, action) {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case actionTypes.FIGHTS_SET:
      return setFights(newState, action);
    case actionTypes.EVENTS_RESET:
      return initialState;
    default:
      return state;
  }
}
