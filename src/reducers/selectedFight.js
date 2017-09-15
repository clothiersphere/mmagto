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
  console.log(state, "state")
  const { fight } = action;
  console.log(event, "event")

  return fight;
}