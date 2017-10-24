import React, { Component } from 'react';
import EventList from './EventList';
import FightCard from './FightCard';

export default class Body extends Component {
  render() {
    const { fights } = this.props;
    const { selectEvent, selectedEvent } = this.props.other;
    return (
      <div>        
        <EventList {...{fights, selectEvent}} />
        <FightCard {...{selectedEvent}} />
      </div>
    );
  }
}