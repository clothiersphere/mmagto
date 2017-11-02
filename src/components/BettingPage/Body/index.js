import React from 'react';
import EventList from './EventList';
import FightCard from './FightCard';
import Banner from './Banner';
import BettingPane from './BettingPane';

export default function Body({ fights, other }) {
  const {
    selectEvent,
    selectedEvent,
    selectedFight,
    selectFight,
  } = other;

  let eventListView = null;
  let bannerView = null;
  let text = null;
  const img = null;

  if (selectedEvent.length === 0) {
    eventListView = <EventList {...{ fights, selectEvent }} />;
  }

  if (selectedEvent[0] && !selectedFight[0]) {
    const { base_title, title_tag_line } = selectedEvent[0].eventInfo;
    text = <div> {base_title}: {title_tag_line} </div>;
    bannerView = <Banner {...{ img, text }} />;
  }
  return (
    <div className="bodyContainer">
      {eventListView}
      {bannerView}
      <FightCard {...{ selectedEvent, selectFight, selectedFight }} />
      <BettingPane {...{ selectedFight }} />
    </div>
  );
}
