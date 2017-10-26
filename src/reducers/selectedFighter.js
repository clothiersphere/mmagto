import * as actionTypes from '../constants/actionTypes';

const initialState = [];

export default function(state = initialState, action) {
  let newState = Object.assign({}, state);
  switch (action.type) {
    case actionTypes.FIGHTER_SET:
      return setFighter(state, action);
    case actionTypes.FIGHTER_RESET:
      return initialState;
  }
  return state;
}

function setFighter(state, action) {
  const { fighter } = action;
  return [...state, fighter];
}