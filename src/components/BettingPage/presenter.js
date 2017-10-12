import React from 'react';
import Header from './Header';
import BettingPane from './BettingPane';
import FighterGallery from './FighterGallery';

function BettingPage(props) {
  return (
    <div className="presenter">
      <Header events={props} />
      <FighterGallery events={props} />
      <BettingPane events={props} />
    </div>
  )
}

export default BettingPage;
