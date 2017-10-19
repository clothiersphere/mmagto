import React from 'react';
import WagerPane from './WagerPane';
import DecisionPane from './DecisionPane';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import {
  Step,
  Stepper,
  StepLabel,
  StepContent,
} from 'material-ui/Stepper';



class VerticalLinearStepper extends React.Component {

  componentDidUpdate(prevProps, prevState) {

    if (this.props.events.selectedFight != prevProps.events.selectedFight) {
      this.reset();
    }
    //if you select original fight
    if ((!this.props.events.selectedFighter.id) && this.state.stepIndex === 2) {
      this.reset()
    }
  }

  constructor(props) {
    super(props);
    this.handleWagerChange = this.handleWagerChange.bind(this);
  }

  state = {
    finished: false,
    stepIndex: 0,
    wagerValue: 0,
    selectedFight: this.props.events.selectedFight
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

  reset = () => {
    this.setState({stepIndex: 0, finished: false})
    // this.renderStepActions(0)
  };

  handleWagerChange(wagerValue) {
    this.setState({wagerValue})
  }

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

  setFight(selectedFight) {
    this.setState({selectedFight})
  }
  
  selectFighter(events, value) {
    events.selectFighter(value);
  }

  render() {
    const {finished, stepIndex} = this.state;
    const { events,visitorInfo,matchInfo,homeInfo } = this.props;
    visitorInfo['odds'] = events.selectedFight.visitorOdds;
    homeInfo['odds'] = events.selectedFight.homeOdds;
    
    return (
      <div style={{maxWidth: 380, maxHeight: 400, margin: 0 }}>
        <Stepper activeStep={stepIndex} orientation="vertical">
          <Step>
            <StepLabel>Select the fighter you want to bet on.</StepLabel>
            <StepContent>
              <RadioButtonGroup name="radio_button" onChange={(event, value) => this.selectFighter(events, value)}>
                <RadioButton
                  value={visitorInfo}
                  label={matchInfo.visitor}
                />
                <RadioButton
                  value={homeInfo}
                  label={matchInfo.home}
                />
              </RadioButtonGroup>
              {this.renderStepActions(0)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Decide how much to bet on.</StepLabel>
            <StepContent>
                <TextField
                  hintText="Enter a dollar amount"
                  type='number'
                  onChange={(e)=> {
                    e.preventDefault();
                    this.setState({wagerValue:e.target.value})
                  }}
                />
              {this.renderStepActions(1)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>See the results</StepLabel>
            <StepContent>
              <DecisionPane
                selectedFighter={events.selectedFighter}
                selectedFight={events.selectedFight}
                wagerValue={this.state.wagerValue}
              />
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
                this.setState({stepIndex: 0, finished: false})
              }}
            >
              Restart
            </a> or select another fight.
          </p>
        )}
      </div>
    )
  }
}

export default VerticalLinearStepper;
