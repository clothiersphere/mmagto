import React from 'react';
import Events from './events';

function BettingPage(events) {

  return (
    <div>
      <Events events={events}/>
    </div>
  )
}

export default BettingPage;
