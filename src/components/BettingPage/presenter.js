import React from 'react';
import Events from './events';
import BettingPane from './BettingPane';
import FightBanner from './FightBanner';

function BettingPage(props) {
  return (
    <div>
      <Events events={props} />
      <FightBanner selectedEvent={props.selectedEvent}/>
      <BettingPane />
    </div>
  )
}

export default BettingPage;
