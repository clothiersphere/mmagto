import * as actionTypes from '../constants/actionTypes';

const initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FIGHTS_GET:
      return getFights(state, action);
  }
  return state;
}

function getFights(state, action) {
  const { fights } = action;
  return [...state, ...fights];
}