import React, { Component } from 'react';
import HomePane from './HomePane';
import VisitorPane from './VisitorPane';

export default class BettingPane extends Component {
  render() {
    const helpers = {
      showRank: function(side) {
        const { rank } = side;
        if (rank === null) {
          return <div className="rank"> Rank: Unranked </div>;
        } 
        if (rank === 'C') {
          return <div className="rank"> Rank: Champion </div>;
        } 
        return <div className="rank"> Rank: #{rank} </div>;
      },
      showNickname: function(side) {
        if (side.nickname === null) {
          return (
            <div className="nickName">
              Nickname: None
            </div>
          )
        } else {
          return (
            <div className="nickName">
              Nickname: {side.nickname}
            </div>
          )
        }
      },
      checkWeight: function(side) {
        if (side.weight_class === null) {
          return 'Null';
        } else {
          return side.weight_class.replace(/\_/g, " ");
        }
      }
    };
    const { selectedFight } = this.props;
    
    if (selectedFight[0]) {     
      const { visitorInfo, homeInfo, matchInfo } = selectedFight[0];      
      
      return (
        <div className="bettingPane"> 
          <HomePane {...{homeInfo, helpers}} />
          <VisitorPane {...{visitorInfo, helpers}} />
        </div>
      );
    }
    return null;
  }
}