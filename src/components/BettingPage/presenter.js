import React from 'react';
import Header from './Header';
import BettingPane from './BettingPane';
import FighterGallery from './FighterGallery';
import Body from './Body';

function BettingPage(props) {
  console.log(props, "props")
  var { fights }  = props;
  console.log(fights, "fights")

  return (
    <div className="presenter">
      <Header events={props} />
      <Body fights={fights} />
    </div>
  )
}

export default BettingPage;
// <div className="fighterGallery">
//   <FighterGallery events={props} />
// </div>
// <BettingPane events={props} />