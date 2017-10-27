import React, { Component } from 'react';
import EventList from './EventList';
import FightCard from './FightCard';
import Banner from './Banner';
import BettingPane from './BettingPane';

export default class Body extends Component {
  // componentDidUpdate(props) {
  //   if (props.other.selectedEvent[0]) {
  //     console.log("don't show eventList")
  //   }
  //   if (props.other.selectedFight[0]) {
  //     console.log("we have a Fight don't show FightCard")
  //   }
  // }

  render() {
    const { fights } = this.props;
    const { selectEvent, selectedEvent, selectedFight, selectFight} = this.props.other;
    let eventListView, bannerView, text, img = null;

    if (selectedEvent.length === 0) {
      eventListView = <EventList {...{fights, selectEvent}} />;
    }
    
    if (selectedEvent[0] && !selectedFight[0]) {
      const { base_title, title_tag_line, secondary_feature_image } = selectedEvent[0].eventInfo;
      text = <div> {base_title}: {title_tag_line} </div>;
      bannerView = <Banner {...{img, text}} />;
    }

    return (
      <div className="bodyContainer">
        {eventListView}
        {bannerView}
        <FightCard {...{selectedEvent, selectFight, selectedFight}} />
        <BettingPane {...{selectedFight}} />
      </div>
    );
  }
}