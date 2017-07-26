import axios from 'axios';
import * as actionTypes from '../constants/actionTypes';

function getOdds(odds) {
  return {
    type: actionTypes.ODDS_GET,
    odds
  };
};

export function getOdds() {
  return function(dispatch) {
    const request = axios({
      method: 'GET',
      url: 'http://localhost:8080/api/getOdds'
    });
    
    return request
    .then((response) => {
      dispatch(getOdds(response.data))
    })
  };
};
