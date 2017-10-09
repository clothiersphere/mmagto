import * as actionTypes from '../constants/actionTypes';

const initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FIGHT_SET:
      return setFight(state, action);
    case actionTypes.FIGHT_RESET:
      return initialState;
  }
  return state;
}

function setFight(state, action) {
  const { fight } = action;
  // return [...state, fight];
  return fight;
}

