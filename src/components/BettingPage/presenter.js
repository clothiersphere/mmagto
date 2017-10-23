import React from 'react';
import Header from './Header';
import BettingPane from './BettingPane';
import FighterCard from './Body/FighterCard';
import Body from './Body';

function BettingPage(props) {
  
  const { fights, ...other }  = props;
 
  return (
    <div className="presenter">
      <Header events={props} />
      <Body {...{fights, other}} />
    </div>
  )
}

export default BettingPage;
// <div className="fighterGallery">
//   <FighterGallery events={props} />
// </div>
// <BettingPane events={props} />