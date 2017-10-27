import React, { Component } from 'react';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

export default class BettingPage extends Component {
  render() {
    const { fights, eventsReset, ...other } = this.props;

    return (
      <div className="presenter">
          <Header {...{eventsReset, other}} />
          <Body {...{fights, other}} />
          <Footer />
      </div>
    );
  }
}

