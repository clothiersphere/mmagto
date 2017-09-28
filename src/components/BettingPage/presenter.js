import React from 'react';
import Events from './Events';
import BettingPane from './BettingPane';
import FightBanner from './FightBanner';

function BettingPage(props) {
  return (
    <div className="presenter">
      <Events events={props} />
      <FightBanner events={props} />
      <BettingPane events={props} />
    </div>
  )
}

export default BettingPage;
