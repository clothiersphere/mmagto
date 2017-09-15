import React from 'react';
import Events from './events';
import BettingPane from './BettingPane';
import FightBanner from './FightBanner';

function BettingPage(props) {
  return (
    <div>
      <Events events={props} />
      <FightBanner selectedEvent={props.selectedEvent} events={props} />
      <BettingPane selectedEvent={props.selectedEvent} />
    </div>
  )
}

export default BettingPage;
