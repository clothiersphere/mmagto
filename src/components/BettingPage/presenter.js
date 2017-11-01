import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';


export default function BettingPage(props) {
  const { fights, eventsReset, ...other } = props;
  return (
    <div className="presenter">
      <Header {...{ eventsReset, other }} />
      <Body {...{ fights, other }} />
      <Footer />
    </div>
  );
}

BettingPage.propTypes = {
  fights: PropTypes.arrayOf(PropTypes.object),
  eventsReset: PropTypes.func,
  other: PropTypes.object,
}

