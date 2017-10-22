import React, { Component } from 'react';
import EventList from './EventList';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react';


export default class Body extends Component {
  
  Body(fights) {
    console.log(fights, "body")
    if (fights.length === 0) {
    return (
      <Segment>
        <Dimmer active>
          <Loader />
        </Dimmer>
      </Segment>
    )
    } else {
      return <EventList event={fights} />
    }
  } 

  render() {
    const { fights } = this.props;
    return (
      <div>
        {this.Body(fights)}
      </div>
    )
  }
}