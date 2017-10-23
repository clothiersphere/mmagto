import React, { Component } from 'react';
import EventDisplay from './EventDisplay';
import FightCard from './FightCard';

import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react';


export default class Body extends Component {

  render() {
    console.log(this.props, "bodyprops")
    const { fights } = this.props;
    const { selectFight, selectedFight } = this.props.other;

    return (
      <div>        
        <EventDisplay {...{fights, selectFight}} />
        <FightCard {...{selectedFight}}/>
      </div>
    )
  }
}