import React from 'react';
import Events from './events';
import BettingPane from './BettingPane';
import FightBanner from './FightBanner';

function BettingPage(events) {

  return (
    <div>
      <Events events={events}/>
      <FightBanner />
      <BettingPane />
    </div>
  )
}

export default BettingPage;
