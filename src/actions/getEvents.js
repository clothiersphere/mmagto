import axios from 'axios';
import * as actionTypes from '../constants/actionTypes';

function showEvents(fights) {
  return {
    type: actionTypes.FIGHTS_GET,
    fights
  };
};

export function getEvents() {
  return function(dispatch) {
    console.log(dispatch, "DP")
    const request = axios({
      method: 'GET',
      url: 'http://localhost:8080/api/getEvents'
    });
    
    return request
    .then((response) => {
      dispatch(showEvents(response.data))
    })
  };
};
