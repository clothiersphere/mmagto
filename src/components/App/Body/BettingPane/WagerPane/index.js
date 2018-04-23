import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Icon, Form, Radio, Button, Step, Input, Label } from 'semantic-ui-react';
// import BettingSlider from './BettingSlider';
import DecisionPane from './DecisionPane';


export default class WagerPane extends Component {
  // constructor(props) {
    // super(props);
    state = {
      wagerValue: '',
    }
    // this.handleChange = this.handleChange.bind(this);
  // }

  handleWagerChange = (e) => {
    this.setState({ 'wagerValue': e.target.value });
  }

  render() {
    console.log(this.props, "wagerpane")
    const { wagerValue } = this.state;
    const {
      homeInfo,
      visitorInfo,
      home,
      visitor,
      selectFight,
      selectedFight,
      selectFighter,
      selectedFighter,
    } = this.props;

    const { props } = this;

    return (
      <div className="wagerPane">
        <Form>
          <Form.Group grouped>
            Select the fighter you wish to wager on:
            <Form.Radio
              label={home}
              name="radioGroup"
              value={home}
              checked={selectedFighter[0] === homeInfo}
              onChange={() => selectFighter(homeInfo)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Radio
              label={visitor}
              name="radioGroup"
              value={visitor}
              checked={selectedFighter[0] === visitorInfo}
              onChange={() => selectFighter(visitorInfo)}
            />
          </Form.Group>
          <Form.Group grouped>
            Select the amount you wish to wager:
            <Form.Input labelPosition="right" type="text" placeholder="Amount" onChange={this.handleWagerChange}>
              <Label basic>$</Label>
              <input />
              <Label>.00</Label>
            </Form.Input>
          </Form.Group>
          <Form.Button onClick={(e, data) => { console.log(e, data, 'e'); }}>Submit</Form.Button>
        </Form>
        <DecisionPane {...props} />
      </div>
    );
  }
}

// WagerPane.propTypes = {
//   other: PropTypes.objectOf(PropTypes.any).isRequired,
//   selectFighter: PropTypes.func.isRequired,
//   selectedFighter: PropTypes.arrayOf(PropTypes.object),
//   home: PropTypes.string,
//   visitor: PropTypes.string,
//   homeInfo: PropTypes.objectOf(PropTypes.any).isRequired,
//   visitorInfo: PropTypes.objectOf(PropTypes.any).isRequired,

// };

// WagerPane.defaultProps = {
//   selectedFighter: [{}],
//   home: 'Home',
//   visitor: 'Visitor',
// };
