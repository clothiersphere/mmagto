import React from 'react';
import axios from 'axios';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import WagerPane from './WagerPane';
import FlatButton from 'material-ui/FlatButton';
import 'rc-slider/assets/index.css';

// import { Button, ButtonToolbar, FormControl, FormGroup, InputGroup, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

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

  function homePanel(info) {
    return (
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
  }

  if (events.selectedFight.homeInfo) {
    var matchInfo = events.selectedFight;
    var visitorInfo = events.selectedFight.visitorInfo;
    var homeInfo = events.selectedFight.homeInfo;

    var active = 0;

    var visitorPanel = (
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

    // function overUnder() {
    //   if ((!matchInfo.over) || (!matchInfo.under)) {
    //     return null;
    //   } else {
    //   <div className="overUnder">
    //     How many rounds do you think it will go?
    //     <ToggleButtonGroup type="radio" name="options">
    //       <ToggleButton value={1}>
    //         Over {matchInfo.over.charAt(1)} Rd:{matchInfo.over.substr(matchInfo.over.indexOf(';')+1)}
    //       </ToggleButton>
    //       <ToggleButton value={2}>
    //         Under {matchInfo.under.charAt(1)} Rd:{matchInfo.under.substr(matchInfo.under.indexOf(';')+1)}
    //       </ToggleButton>
    //     </ToggleButtonGroup>
    //   </div>
    //   } 
    // }

    function decisionPanel() {
      return (
        <div className="decision_panel">
          Based on the current odds of {matchInfo.visitor} at {matchInfo.visitorOdds}
          <br/>
          If {matchInfo.visitor} won, your bet of 100 dollars would
          <br/>
          win you ${+(100*((matchInfo.visitorOdds)/100)).toFixed(2)} for a total payout of ${+(100*((matchInfo.visitorOdds)/100)).toFixed(2) + 100}
        </div>
      )
    }
    //takes selectedFighter odds.
    //takes amount wagered 

    //returns dollar amount.


    function calculateWager() {

    }

    function active() {

    }

    // {overUnder}
    var wagerPanel = (
      <div className="wager_pane">
        <FlatButton label={matchInfo.visitor} fullWidth={true} />
        <FlatButton label={matchInfo.home} fullWidth={true} />
        <div className="wager_amount">
        How much do you want to bet?
        <WagerPane />
        </div>
       
       {decisionPanel()}   
      </div>
    )

    return (
     <div className="large_faceOff_container">
      <div className="visitorSide">
        {visitorPanel}
        <div className="large_faceOff_visitor">
          <img src={visitorInfo.left_full_body_image} />
        </div>
      </div>
      {wagerPanel}
      <div className="homeSide">
        {homePanel(homeInfo)}
        <div className="large_faceOff_home">
          <img src={homeInfo.right_full_body_image} />
        </div>
      </div>
    </div>
    )
  } else {
    return <div> Please select a fight. </div>
  }
} 



export default BettingPane;