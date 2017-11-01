import React, { Component } from 'react';
import EventItem from './EventItem';
import EventListLoader from './EventListLoader';

export default class EventList extends Component {
 render() {
    const { fights, selectEvent } = this.props;

    if (fights.length === 0) {
      return <EventListLoader />;
    } else {
      return (
        <ul className="eventList">
          {fights.map(function(event, index) {
            return (
              <li
                className="eventItem"
                onClick={()=>selectEvent(event)}
                key={index} 
              >
                <EventItem event={event} />
              </li>
            );
          })}
        </ul>
      );
    }
  }
}

