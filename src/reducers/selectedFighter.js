import * as actionTypes from '../constants/actionTypes';

const initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FIGHTER_SET:
      return setFighter(state, action);
  }
  return state;
}

function setFighter(state, action) {
  const { fighter } = action;
  return fighter;
}
