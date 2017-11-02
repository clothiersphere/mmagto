import React from 'react';
import PropTypes from 'prop-types';
import EventItem from './EventItem';
import EventListLoader from './EventListLoader';

export default function EventList({ fights, selectEvent }) {
  if (fights.length === 0) {
    return <EventListLoader />;
  }
  return (
    <ul className="eventList">
      {fights.map((event, index) => {
        if (event.eventInfo) {
          return (
            <li
              className="eventItem"
              onClick={() => selectEvent(event)}
              key={index}
            >
              <EventItem event={event} />
            </li>
          );
        }
        return null;
      })}
    </ul>
  );
}

EventList.propTypes = {
  fights: PropTypes.arrayOf(PropTypes.object),
  selectEvent: PropTypes.func.isRequired,
};

EventList.defaultProps = {
  fights: [],
};
