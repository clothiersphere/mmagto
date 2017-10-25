import React, { Component } from 'react';
import EventList from './EventList';
import FightCard from './FightCard';
import Banner from './Banner';

export default class Body extends Component {
  render() {
    const { fights } = this.props;
    const { selectEvent, selectedEvent } = this.props.other;
    let display = null;
    let text = null;
    if (selectedEvent.length === 0) {
      display = <EventList {...{fights, selectEvent}} />;
    }
    if (selectedEvent[0]) {
      const { base_title, title_tag_line } = selectedEvent[0].eventInfo;
      text = <div> {base_title}: {title_tag_line} </div>;
    }
    
    // if (selectedEvent[0]) {
    //   display = <div className="banner"> <div className="bannerText">Select Fight </div></div>;
    // }

    return (
      <div className="bodyContainer">
        {display}
        <Banner {...{text}} />
        <FightCard {...{selectedEvent}} />
      </div>
    );
  }
}