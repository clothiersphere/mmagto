import React from 'react';
import Header from './Header';
import BettingPane from './BettingPane';
import FightBanner from './FightBanner';

function BettingPage(props) {

  
  return (
    <div className="presenter">
      <Header events={props} />
      <FightBanner events={props} />
      <BettingPane events={props} />
    </div>
  )
}

export default BettingPage;
