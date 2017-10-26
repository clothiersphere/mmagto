import React, { Component } from 'react';
import EventList from './EventList';
import FightCard from './FightCard';
import Banner from './Banner';
import BettingPane from './BettingPane';

export default class Body extends Component {
  render() {
    const { fights } = this.props;
    const { selectEvent, selectedEvent, selectedFight, selectFight} = this.props.other;
    let display = null;
    let text = null;
    let img = null;
    if (selectedEvent.length === 0) {
      display = <EventList {...{fights, selectEvent}} />;
    }
    if (selectedEvent[0]) {
      const { base_title, title_tag_line, secondary_feature_image } = selectedEvent[0].eventInfo;
      text = <div> {base_title}: {title_tag_line} </div>;
      // img = <img src={secondary_feature_image} height="100" width="200"/>
    }
    return (
      <div className="bodyContainer">
        {display}
        <Banner {...{img, text}} />
        <FightCard {...{selectedEvent, selectFight}} />
        <BettingPane {...{selectedFight}} />
      </div>
    );
  }
}