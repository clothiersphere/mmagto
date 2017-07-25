import * as actionTypes from '../constants/actionTypes';

const initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ODDS_GET:
      return getOdds(state, action);
  }
  return state;
}

function getOdds(state, action) {
  const { odds } = action;
  return [...state, ...odds ];
}