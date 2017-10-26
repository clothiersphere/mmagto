import React, { Component } from 'react';
// import HomePane from './HomePane';
import VisitorPane from './VisitorPane';

export default class BettingPane extends Component {

  render() {
    const { selectedFight } = this.props;
    if (selectedFight[0]) {     
      const { visitorInfo, homeInfo, matchInfo } = selectedFight[0];
      var homePanel = (
        <div className="large_faceOff_homeInfo">
          <div className="large_faceOff_homeInfo_name">
            Name: {homeInfo.first_name} {homeInfo.last_name}
          </div>
          {showNickname(homeInfo)}
          <div className="large_faceOff_homeInfo_weightclass">
            Weightclass: {checkWeight(homeInfo)}
          </div>
            {showRank(homeInfo)}
          <div className="large_faceOff_homeInfo_record">
            Record: {homeInfo.wins}-{homeInfo.losses}-{homeInfo.draws} (W-L-D)
          </div>
        </div>
      )
      // <HomePane {...homeInfo}/>
      return (
        <div className="bettingPane"> 
          
          <VisitorPane {...{visitorInfo, showRank, showNickname, checkWeight}}/>
        </div>
      );
    }
    return null;
  }
}
 // function showRank(side) {
 //    if ( side === visitorInfo) {
 //      if (side.rank === null) {
 //        return <div className="large_faceOff_visitorInfo_rank"> Rank: Unranked </div>
 //      } 
 //      if (side.rank === 'C') {
 //        return <div className="large_faceOff_visitorInfo_rank"> Rank: Champion </div>
 //      } else {
 //        return <div className="large_faceOff_visitorInfo_rank"> Rank: #{ events.selectedFight.visitorInfo.rank } </div>
 //      }
 //    } else {
 //      if ( side === homeInfo) {
 //        if (side.rank === null) {
 //          return <div className="large_faceOff_homeInfo_rank"> Rank: Unranked </div>
 //        } 
 //        if (side.rank === 'C') {
 //          return <div className="large_faceOff_homeInfo_rank"> Rank: Champion </div>
 //        } else {
 //          return <div className="large_faceOff_homeInfo_rank"> Rank: #{ events.selectedFight.homeInfo.rank } </div>
 //        }
 //      }
 //    }
 //  }

function showRank(side) {

  const { rank } = side;

  if (rank === null) {
    return <div className="large_faceOff_visitorInfo_rank"> Rank: Unranked </div>;
  } 
  if (rank === 'C') {
    return <div className="large_faceOff_visitorInfo_rank"> Rank: Champion </div>;
  } 
  return <div className="large_faceOff_visitorInfo_rank"> Rank: #{rank} </div>;
}
  // function showNickname(side) {
  //   console.log(side, "side")
  //   if ( side === visitorInfo) {
  //     if (side.nickname === null) {
  //       return (
  //         <div className="large_faceOff_visitorInfo_nickname">
  //           Nickname: None
  //         </div>
  //       )
  //     } else {
  //       return (
  //         <div className="large_faceOff_visitorInfo_nickname">
  //           Nickname: {side.nickname}
  //         </div>
  //       )
  //     }
  //   } else {
  //     if (side === homeInfo) {
  //       if (side.nickname === null) {
  //         return (
  //           <div className="large_faceOff_homeInfo_nickname">
  //             Nickname: None
  //           </div>
  //         )
  //       } else {
  //         return (
  //           <div className="large_faceOff_homeInfo_nickname">
  //             Nickname: {side.nickname}
  //           </div>
  //         )
  //       }
  //     }
  //   }
  // }

  function showNickname(side) {
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
    }

  function checkWeight(side) {
        if (side.weight_class === null) {
          return 'Null'
        } else {
          return side.weight_class.replace(/\_/g, " ")
        }
  }

  // <div className="large_faceOff_container">
  //       <div className="homeSide">
  //         {homePanel}
  //         
  //       </div>
  //       <div className="visitorSide">
  //         {visitorPane}
  //         <div className="large_faceOff_visitor">
  //           <img src={visitorInfo.right_full_body_image} />
  //         </div>
  //       </div>
  //     </div>