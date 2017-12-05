import * as actionTypes from '../constants/actionTypes';

const initialState = [];

function getFights(state, action) {
  const { fights } = action;
  return [...state, ...fights];
}

export default function (state = initialState, action) {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case actionTypes.FIGHTS_GET:
      return getFights(newState, action);
    default:
      return state;
  }
}
