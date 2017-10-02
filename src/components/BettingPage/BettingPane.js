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

function decisionPanel() {
  return (
    <div className="decision_panel">
      {matchInfo.visitor} is currently {matchInfo.visitorOdds}
      <br/>
      If {matchInfo.visitor} won, your bet of 100 dollars would
      <br/>
      win you ${+(100*((matchInfo.visitorOdds)/100)).toFixed(2)} for a total payout of ${+(100*((matchInfo.visitorOdds)/100)).toFixed(2) + 100}
    </div>
  )
}

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

class BettingPane extends React.Component {

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

        if (events.selectedFight.homeInfo) {
          var matchInfo = events.selectedFight;
          var visitorInfo = events.selectedFight.visitorInfo;
          var homeInfo = events.selectedFight.homeInfo;

        return (
          <div className="large_faceOff_container">
           <div className="visitorSide">
             {visitorPanel}
             <div className="large_faceOff_visitor">
               <img src={visitorInfo.left_full_body_image} />
             </div>
           </div>
           <div className="wager_pane">
              <div style={{maxWidth: 400, maxHeight: 400, margin: 'auto', marginTop: '0px'}}>
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
                        <BettingPane />
                      </div>
                      {this.renderStepActions(1)}
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>See the results</StepLabel>
                    <StepContent>
                      {decisionPanel()}
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
                        setTimeout( () => this.setState({
                          stepIndex: 0, finished: false
                        }));
                      }}
                    >
                      Click here
                    </a> to reset the example.
                  </p>
                )}
              </div>
            </div>
            <div className="homeSide">
              {homePanel(homeInfo)}
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
}

export default BettingPane;