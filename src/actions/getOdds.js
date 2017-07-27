import axios from 'axios';
import * as actionTypes from '../constants/actionTypes';

function showOdds(odds) {
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
      dispatch(showOdds(response.data))
    })
  };
};