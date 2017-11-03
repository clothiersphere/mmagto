import React, { Component } from 'react';
import { Form, Radio } from 'semantic-ui-react';

export default class WagerPane extends Component {
  state = {};
  handleChange = (e, { value }) => this.setState({ value });

  render() {
    console.log(this.props, 'props in WP');
    return (
      <div className="WagerPane">
        <Form>
          <Form.Field>
            Select the fighter to bet on: <b> {this.state.value} </b>
          </Form.Field>
          <Form.Field>
            <Radio
              label="Home"
              name="radioGroup"
              value="this"
              checked={this.state.value === 'home'}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Radio
              label="Visitor"
              name="radioGroup"
              value="this"
              checked={this.state.value === 'visitor'}
              onChange={this.handleChange}
            />
          </Form.Field>
        </Form>
      </div>
    );
  }
}
