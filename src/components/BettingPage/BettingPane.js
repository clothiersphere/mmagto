import React from 'react';
import axios from 'axios';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import WagerPane from './WagerPane';
import FlatButton from 'material-ui/FlatButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import 'rc-slider/assets/index.css';
import {
  Step,
  Stepper,
  StepLabel,
  StepContent,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';

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

    class VerticalLinearStepper extends React.Component {
      state = {
        finished: false,
        stepIndex: 0,
      };

      handleNext = () => {
        const {stepIndex} = this.state;
        this.setState({
          stepIndex: stepIndex + 1,
          finished: stepIndex >= 2,
        });
      };

      handlePrev = () => {
        const {stepIndex} = this.state;
        if (stepIndex > 0) {
          this.setState({stepIndex: stepIndex - 1});
        }
      };

      renderStepActions(step) {
        const {stepIndex} = this.state;

        return (
          <div style={{margin: '12px 0'}}>
            <RaisedButton
              label={stepIndex === 2 ? 'Finish' : 'Next'}
              disableTouchRipple={true}
              disableFocusRipple={true}
              primary={true}
              onClick={this.handleNext}
              style={{marginRight: 12}}
            />
            {step > 0 && (
              <FlatButton
                label="Back"
                disabled={stepIndex === 0}
                disableTouchRipple={true}
                disableFocusRipple={true}
                onClick={this.handlePrev}
              />
            )}
          </div>
        );
      }

      render() {
        const {finished, stepIndex} = this.state;

        return (
          <div style={{maxWidth: 380, maxHeight: 400, margin: 'auto'}}>
            <Stepper activeStep={stepIndex} orientation="vertical">
              <Step>
                <StepLabel>Select the fighter you want to bet on.</StepLabel>
                <StepContent>
                  <RadioButtonGroup name="radio_button" onChange={(event, value) => events.selectFighter(value)}>
                    <RadioButton
                      value={events.selectedFight.visitorInfo}
                      label={matchInfo.visitor}
                    />
                    <RadioButton
                      value={events.selectedFight.homeInfo}
                      label={matchInfo.home}
                    />
                  </RadioButtonGroup>
                  {this.renderStepActions(0)}
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Decide how much to bet on.</StepLabel>
                <StepContent>
                  <div className="wager_amount">
                    <WagerPane />
                  </div>
                  {this.renderStepActions(1)}
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Create an ad</StepLabel>
                <StepContent>
                  <p>
                    Try out different ad text to see what brings in the most customers,
                    and learn how to enhance your ads using features like ad extensions.
                    If you run into any problems with your ads, find out how to tell if
                    they're running and how to resolve approval issues.
                  </p>
                  {this.renderStepActions(2)}
                </StepContent>
              </Step>
            </Stepper>
            {finished && (
              <p style={{margin: '20px 0', textAlign: 'center'}}>
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    this.setState({stepIndex: 0, finished: false});
                  }}
                >
                  Click here
                </a> to reset the example.
              </p>
            )}
          </div>
        );
      }
    }

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
      <VerticalLinearStepper />
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