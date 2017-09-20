import React from 'react';
import axios from 'axios';

function BettingPane({events={}}) {
  function displayEvent(selectedEvent) {
    return selectedEvent.fights.map((fight, key) => {

      function convertOdds(number) {
        if (number > 0) {
          var udParse = number.substr(number.indexOf('+')+1)
          return <div className="fighter odds"> $100 wins you ${udParse} </div>  
        } else {
          var favCalc = (number*(-1))/100
          favCalc = Math.round(100/favCalc)
          return <div className="fighter odds"> $100 wins you ${favCalc} </div>
        }
      }

      console.log(fight, "fight");

      function homeFighter() {
        return (
          <div className="homeFighter">
            <div className="fighter portrait">
              <img className="portrait" src={fight.homeInfo.profile_image}/>
            </div>
            <div className="fighter name">
              {fight.homeInfo.first_name} {fight.homeInfo.last_name}
              <br/>
              {fight.homeInfo.wins}-{fight.homeInfo.losses}-{fight.homeInfo.draws}
            </div>
              <div className="fighter odds">
                {convertOdds(fight.visitorOdds)}
              </div>
              <div className="fighter slider">
                <form className="payoutSlider">
                  <input type="slider"/>
                </form>
              </div>
              <div className="fighter check">
                <form className="winnerCheck">
                  <input type="checkbox"/>
                </form>
              </div>
            </div>
          
        )
      }
      function homeFighterNoInfo() {
        return (
          <div className="homeFighter">
            <div className="fighter portrait">
              <img className="portrait" src={fight.homeInfo.thumbnail}/>
            </div>
            <div className="fighter name">
              {fight.home}
            </div>
            <div className="fighter odds">
              {convertOdds(fight.homeOdds)}
            </div>
            <div className="fighter slider">
              <form className="payoutSlider">
                <input type="slider"/>
              </form>
            </div>
            <div className="fighter check">
              <form className="winnerCheck">
                <input type="checkbox"/>
              </form>
            </div>
          </div>
        )
      }
      function visitorFighter() {
        return (
        <div className="visitorFighter">
          <div className="fighter portrait">
            <img className="portrait" src={fight.visitorInfo.profile_image}/>
          </div>
          <div className="fighter name">
            {fight.visitorInfo.first_name} {fight.visitorInfo.last_name}
            <br/>
            {fight.visitorInfo.wins}-{fight.visitorInfo.losses}-{fight.visitorInfo.draws}
          </div>
          <div className="fighter odds">
            {convertOdds(fight.visitorOdds)}
          </div>
          <div className="fighter slider">
            <form className="payoutSlider">
              <input type="slider"/>
            </form>
          </div>
          <div className="fighter check">
            <form className="winnerCheck">
              <input type="checkbox"/>
            </form>
          </div>
        </div>
        )
      }

      return (
        <div className="bettingPane" key={key}>
        
        </div>
      )
    })
  }

  function showRank(side) {
    if ( side === visitor) {
      if (events.selectedFight.visitorInfo.rank === null) {
        return <div className="large_faceOff_visitorInfo_rank"> Rank: Unranked </div>
      } else {
        return <div className="large_faceOff_visitorInfo_rank"> Rank: #{ events.selectedFight.visitorInfo.rank } </div>
      }
    } else {
      if ( side === home) {
        if (events.selectedFight.homeInfo.rank === null) {
          return <div className="large_faceOff_homeInfo_rank"> Rank: Unranked </div>
        } else {
          return <div className="large_faceOff_homeInfo_rank"> Rank: #{ events.selectedFight.homeInfo.rank } </div>
        }
      }
    }
  }

  function showNickname(side) {
    if ( side === visitor) {
      if (events.selectedFight.visitorInfo.nickname === null) {
        return (
          <div className="large_faceOff_visitorInfo_nickname">
            Nickname: None
          </div>
        )
      } else {
        return (
          <div className="large_faceOff_visitorInfo_nickname">
            Nickname: {visitor.nickname}
          </div>
        )
      }
    } else {
      if (side === home) {
        if (events.selectedFight.homeInfo.nickname === null) {
          return (
            <div className="large_faceOff_homeInfo_nickname">
              Nickname: None
            </div>
          )
        } else {
          return (
            <div className="large_faceOff_homeInfo_nickname">
              Nickname: {home.nickname}
            </div>
          )
        }
      }
    }
  }

  if (events.selectedFight.homeInfo) {

    var visitor = events.selectedFight.visitorInfo;
    var home = events.selectedFight.homeInfo;

    return (
     <div className="large_faceOff_container">
      <div className="large_faceOff_visitor">
      <img src={visitor.left_full_body_image} />
      </div>
      <div className="large_faceOff_visitorInfo">
        <div className="large_faceOff_visitorInfo_name">
          Name: {visitor.first_name} {visitor.last_name}
        </div>
          {showNickname(visitor)}
        <div className="large_faceOff_visitorInfo_weightclass">
          Weightclass: {visitor.weight_class.replace(/\_/g, " ")}
        </div>
          {showRank(visitor)}
        <div className="large_faceOff_visitorInfo_record">
          Record: {visitor.wins}-{visitor.losses}-{visitor.draws} (W-L-D)
        </div>
      </div>
      <div className="large_faceOff_homeInfo">
        <div className="large_faceOff_homeInfo_name">
          Name: {home.first_name} {home.last_name}
        </div>
        {showNickname(home)}
        <div className="large_faceOff_homeInfo_weightclass">
          Weightclass: {home.weight_class.replace(/\_/g, " ")}
        </div>
          {showRank(home)}
        <div className="large_faceOff_homeInfo_record">
          Record: {home.wins}-{home.losses}-{home.draws} (W-L-D)
        </div>
      </div>
      <div className="large_faceOff_home">
      <img src={home.right_full_body_image} />
      </div>
    </div>
    )
  } else {
    return <div> Please select a fight. </div>
  }
} 

export default BettingPane;