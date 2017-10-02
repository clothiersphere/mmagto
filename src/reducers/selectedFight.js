import * as actionTypes from '../constants/actionTypes';

const initialState = [];

export default function(state = initialState, action) {
  console.log(state, "state")
  switch (action.type) {
    case actionTypes.FIGHT_SET:
      return setFight(state, action);
  }
  return state;
}

function setFight(state, action) {
  console.log(action, "action")
  const { fight } = action;
  return fight;
}

