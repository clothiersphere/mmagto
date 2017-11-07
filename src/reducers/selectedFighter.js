import * as actionTypes from '../constants/actionTypes';

const initialState = [];

function setFighter(state, action) {
  const { fighter } = action;
  return [...state, fighter];
}

export default function (state = initialState, action) {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case actionTypes.FIGHTER_SET:
      return setFighter(newState, action);
    case actionTypes.FIGHTER_RESET:
      return initialState;
  }
  return state;
}
