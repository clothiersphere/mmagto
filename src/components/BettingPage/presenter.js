import React from 'react';
import Header from './Header';
import Body from './Body';

function BettingPage(props) {
  const { fights, eventsReset, ...other } = props;
  return (
    <div className="presenter">
      <Header {...{eventsReset, other}} />
      <Body {...{fights, other}} />
    </div>
  );
}

export default BettingPage;