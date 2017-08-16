import React from 'react';

function selectEvent(event) {
  return {
    type: actionTypes.FIGHTS_SET,
    event
  };
};

export default selectEvent;

