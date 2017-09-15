import * as actionTypes from '../constants/actionTypes';

const initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FIGHT_SET:
      return setFight(state, action);
  }
  return state;
}

function setFight(state, action) {
  const { fight } = action;
  return fight;
}

