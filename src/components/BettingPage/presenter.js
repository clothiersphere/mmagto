import React from 'react';
import Header from './Header';
import BettingPane from './BettingPane';
import FighterGallery from './FighterGallery';

function BettingPage(props) {
  return (
    <div className="presenter">
      <Header events={props} />
      <div className="fighterGallery">
        <FighterGallery events={props} />
      </div>
      <BettingPane events={props} />
    </div>
  )
}

export default BettingPage;
