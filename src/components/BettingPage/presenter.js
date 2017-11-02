import React from 'react';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

export default function BettingPage(data) {
  const { fights, eventsReset, ...other } = data;
  return (
    <div className="presenter">
      <Header {...{ eventsReset, other }} />
      <Body {...{ fights, other }} />
      <Footer />
    </div>
  );
}
