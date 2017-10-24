import React, { Component } from 'react';
import EventList from './EventList';
import FightCard from './FightCard';

export default class Body extends Component {
  render() {
    const { fights } = this.props;
    const { selectEvent, selectedEvent } = this.props.other;
    let choice = null;

    if (selectedEvent.length === 0) {
      choice = <EventList {...{fights, selectEvent}} />;
    }  

    return (
      <div className="bodyContainer">        
        {choice} 
        <FightCard {...{selectedEvent}} />
      </div>
    );
  }
}