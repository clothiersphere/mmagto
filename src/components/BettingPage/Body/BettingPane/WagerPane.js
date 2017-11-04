import React, { Component } from 'react';
import { Accordion, Icon, Form, Radio } from 'semantic-ui-react';

export default class WagerPane extends Component {
  state = { activeIndex: 0 };

  handleChange = (e, { value }) => this.setState({ value });
  render() {
    const { activeIndex } = this.state;

    const {
      home,
      homeOdds,
      homeInfo,
      visitor,
      visitorOdds,
      visitorInfo,
    } = this.props.other.selectedFight[0];

    return (
      <div className="wagerPane">
        <Accordion>
          <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
            <Icon name='dropdown' />
            Select a fighter to wager on.
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <Form>
              <Form.Field>
                <Radio
                  label={home}
                  name="radioGroup"
                  value={home}
                  checked={this.state.value === home}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label={visitor}
                  name="radioGroup"
                  value={visitor}
                  checked={this.state.value === visitor}
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Accordion.Content>
          <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
            <Icon name='dropdown' />
            Select amount to wager.
          </Accordion.Title>
        </Accordion>
      </div>
    );
  }
}
