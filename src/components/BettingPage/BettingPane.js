import React from 'react';
import axios from 'axios';


const url = 'http://ufc-data-api.ufc.com/api/v1/us/events';

function getEvent() {
  axios.get(url).then(
    response => console.log(response)
  )
  .catch((error) => {
    console.log('ERROR', error);
  })
}

function BettingPane() {
  return <div>{getEvent()}</div>
} 

export default BettingPane;