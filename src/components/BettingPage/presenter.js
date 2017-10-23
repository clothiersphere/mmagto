import React from 'react';
import Header from './Header';
import Body from './Body';

function BettingPage(props) {
  const { fights, ...other }  = props;
  return (
    <div className="presenter">
      <Header events={props} />
      <Body {...{fights, other}} />
    </div>
  );
}

export default BettingPage;