import * as actionTypes from '../constants/actionTypes';

const initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FIGHTS_SET:
      return setFight(state, action);
  }
  return state;
}

function setFight(state, action) {
  console.log(action, "action")
  console.log(action.event, "actionevent")
  const { event } = action;
  console.log(event, "fight")

  return [...state, event];
}