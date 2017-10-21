import React from 'react';
import Header from './Header';
import BettingPane from './BettingPane';
import FighterGallery from './FighterGallery';
import Body from './Body';

function BettingPage(props) {
  return (
    <div className="presenter">
      <Header events={props} />
      <Body events={props} />
    </div>
  )
}

export default BettingPage;
// <div className="fighterGallery">
//   <FighterGallery events={props} />
// </div>
// <BettingPane events={props} />