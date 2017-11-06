import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Icon, Form, Radio, Button, Step, Input, Label } from 'semantic-ui-react';
import BettingSlider from './BettingSlider';
import DecisionPane from './DecisionPane';


export default class WagerPane extends Component {
  state = { activeIndex: 0, wagerValue: 0 };

  handleChange = (e, { value }) => {
    this.selectFighter(e, value);
    this.setState({ value });
  }

  selectFighter(e, value) {
    const { selectFighter } = this.props.other;
    selectFighter(value);
  }

  render() {
    const { wagerValue } = this.state;

    const {
      home,
      homeOdds,
      homeInfo,
      visitor,
      visitorOdds,
      visitorInfo,
    } = this.props.other.selectedFight[0];

    const {
      selectedFight,
      selectedFighter,
    } = this.props.other;

    return (
      <div className="wagerPane">
        <Form>
          <Form.Group>
            Select the fighter you wish to wager on:
            <Form.Radio
              label={home}
              name="radioGroup"
              value={home}
              checked={this.state.value === home}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Radio
              label={visitor}
              name="radioGroup"
              value={visitor}
              checked={this.state.value === visitor}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group>
            Select the amount you wish to wager:
            <Form.Input labelPosition="right" type="text" placeholder="Amount" >
              <Label basic>$</Label>
              <input />
              <Label>.00</Label>
            </Form.Input>
          </Form.Group>
          <Form.Button>Submit</Form.Button>
        </Form>
        <DecisionPane {...{ selectedFight, selectedFighter, wagerValue }} />
      </div>
    );
  }
}

WagerPane.propTypes = {
  selectedFighter: PropTypes.arrayOf(PropTypes.object),
};

WagerPane.defaultProps = {
  selectedFighter: [{}],
};