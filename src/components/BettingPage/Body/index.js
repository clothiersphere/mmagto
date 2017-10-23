import React, { Component } from 'react';
import EventList from './EventList';
import FightCard from './FightCard';

export default class Body extends Component {
  render() {
    const { fights } = this.props;
    const { selectFight, selectedFight } = this.props.other;
    return (
      <div>        
        <EventList {...{fights, selectFight}} />
        <FightCard {...{selectedFight}} />
      </div>
    );
  }
}