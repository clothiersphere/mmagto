import React, { Component } from 'react';
import Header from './Header';
import Body from './Body';

export default class BettingPage extends Component {
// function BettingPage(props) {
  // const { fights, eventsReset, ...other } = props;
  

  render() {
    const { fights, eventsReset, ...other } = this.props;
    console.log(this.props, "thisprops")
    const { selectedFight } = this.props;

    return (
      <div className="presenter">
        <div className="header"> 
          <Header {...{eventsReset, other, selectedFight}} />
        </div>
          <Body {...{fights, other}} />
        <div className="footer"> 
        </div>
      </div>
    );
  }
}