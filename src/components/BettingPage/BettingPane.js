import React from 'react';
import axios from 'axios';
import VerticalLineStepper from './VerticalLineStepper';
import visitorPanel from './visitorPanel';


function BettingPane({events={}}) {
  
  function showRank(side) {
    if ( side === visitorInfo) {
      if (events.selectedFight.visitorInfo.rank === null) {
        return <div className="large_faceOff_visitorInfo_rank"> Rank: Unranked </div>
      } else {
        return <div className="large_faceOff_visitorInfo_rank"> Rank: #{ events.selectedFight.visitorInfo.rank } </div>
      }
    } else {
      if ( side === homeInfo) {
        if (events.selectedFight.homeInfo.rank === null) {
          return <div className="large_faceOff_homeInfo_rank"> Rank: Unranked </div>
        } else {
          return <div className="large_faceOff_homeInfo_rank"> Rank: #{ events.selectedFight.homeInfo.rank } </div>
        }
      }
    }
  }

  function showNickname(side) {
    if ( side === visitorInfo) {
      if (events.selectedFight.visitorInfo.nickname === null) {
        return (
          <div className="large_faceOff_visitorInfo_nickname">
            Nickname: None
          </div>
        )
      } else {
        return (
          <div className="large_faceOff_visitorInfo_nickname">
            Nickname: {visitorInfo.nickname}
          </div>
        )
      }
    } else {
      if (side === homeInfo) {
        if (events.selectedFight.homeInfo.nickname === null) {
          return (
            <div className="large_faceOff_homeInfo_nickname">
              Nickname: None
            </div>
          )
        } else {
          return (
            <div className="large_faceOff_homeInfo_nickname">
              Nickname: {homeInfo.nickname}
            </div>
          )
        }
      }
    }
  }

  if (events.selectedFight.homeInfo) {
    var matchInfo = events.selectedFight;
    var visitorInfo = events.selectedFight.visitorInfo;
    var homeInfo = events.selectedFight.homeInfo;

    var homePanel = (
      <div className="large_faceOff_homeInfo">
        <div className="large_faceOff_homeInfo_name">
          Name: {homeInfo.first_name} {homeInfo.last_name}
        </div>
        {showNickname(homeInfo)}
        <div className="large_faceOff_homeInfo_weightclass">
          Weightclass: {homeInfo.weight_class.replace(/\_/g, " ")}
        </div>
          {showRank(homeInfo)}
        <div className="large_faceOff_homeInfo_record">
          Record: {homeInfo.wins}-{homeInfo.losses}-{homeInfo.draws} (W-L-D)
        </div>
      </div>
    )

    var visitorPane = (
      <div className="large_faceOff_visitorInfo">
          <div className="large_faceOff_visitorInfo_name">
            Name: {visitorInfo.first_name} {visitorInfo.last_name}
          </div>
          {showNickname(visitorInfo)}
          <div className="large_faceOff_visitorInfo_weightclass">
            Weightclass: {visitorInfo.weight_class.replace(/\_/g, " ")}
          </div>
          {showRank(visitorInfo)}
          <div className="large_faceOff_visitorInfo_record">
            Record: {visitorInfo.wins}-{visitorInfo.losses}-{visitorInfo.draws} (W-L-D)
          </div>
        </div>
    )
    
    return (
      <div className="large_faceOff_container">
        <div className="visitorSide">
          <visitorPanel />
          {visitorPane}
          <div className="large_faceOff_visitor">
            <img src={visitorInfo.left_full_body_image} />
          </div>
        </div>
        <VerticalLineStepper 
          events={events} 
          matchInfo={events.selectedFight} 
          visitorInfo={events.selectedFight.visitorInfo} 
          homeInfo={events.selectedFight.homeInfo}
        />
        <div className="homeSide">
          {homePanel}
          <div className="large_faceOff_home">
            <img src={homeInfo.right_full_body_image} />
          </div>
        </div>
      </div>
    )
  } else {
    return <div className="text_greeting">select a fight. </div>
  }
} 

export default BettingPane;
