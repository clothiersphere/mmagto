import React, { Component } from 'react';
import { Accordion, Icon, Form, Radio, Button, Step, Input, Label } from 'semantic-ui-react';
import BettingSlider from './BettingSlider';
import DecisionPane from './DecisionPane';


export default class WagerPane extends Component {
  state = { activeIndex: 0, wagerValue: 0 };

  handleChange = (e, { value }) => {
  this.selectFighter(events, value)
    this.setState({ value })
  }

  selectFighter(events, value) {
    events.selectFighter(value);
  }
  
  render() {
    const { value } = this.state;
    console.log(this.props, "WP PROPS")

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

    console.log(selectedFight, selectedFighter, "SF")

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
        <DecisionPane
          selectedFighter={selectedFighter}
          selectedFight={selectedFight}
          wagerValue={this.state.wagerValue}
        />
      </div>
    );
    // return (
    //   <div className="wagerPane">
    //     <Accordion>
    //       <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
    //         <Icon name="dropdown" />
    //         Select a fighter to wager on.
    //       </Accordion.Title>
    //       <Accordion.Content active={activeIndex === 0}>
    //         
    //       </Accordion.Content>
          
    //       <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
    //         <Icon name='dropdown' />
    //         Select amount to wager.
    //       </Accordion.Title>
    //       <Accordion.Content active={activeIndex === 1}>
    //       {this.wagerValue}
    //         <Form>
    //           <Form.Group>
    //             <Form.Input placeholder='Enter amount to wager' value={this.wagerValue} onChange={this.wagerChange} />
    //             <Button type='submit'> Submit </Button> 
    //           </Form.Group>
    //         </Form>
    //       </Accordion.Content>

    //     </Accordion>
    //   </div>
    // );
  }
}
