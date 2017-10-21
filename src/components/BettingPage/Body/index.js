import React, { Component } from 'react';
import EventList from './EventList';

export default class Body extends Component {
  render() {
    const {events} = this.props;
    console.log(this.props, "bodyprops")
    console.log(events, "eventsinbody")
    
    return (
      <div>
        <EventList events={events} />
      </div>
    )
  }
}