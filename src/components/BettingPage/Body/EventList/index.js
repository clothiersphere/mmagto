import React, { Component } from 'react';
import { Link, browerHistory } from 'react-router';
import PropTypes from 'prop-types';
import EventItem from './EventItem';
import EventListLoader from './EventListLoader';

export default class EventList extends Component {

  handleClick(event) {
    const { selectEvent } = this.props;
    selectEvent(event);
  }

  render() {
    const { fights } = this.props;
    const links = fights.map((event, index) => {
      if (event.eventInfo) {
        return (
          <li
            className="eventItem"
            onClick={() => this.handleClick(event)}
            key={index}
          >
            <EventItem event={event} />
          </li>
        );
      }
    });

    if (fights.length === 0) {
      return <EventListLoader />;
    } else { 

    return (
      <ul className="eventList">
        {links}
      </ul>
    );
    }
  }
}

EventList.propTypes = {
  fights: PropTypes.arrayOf(PropTypes.object),
  selectEvent: PropTypes.func.isRequired,
};

EventList.defaultProps = {
  fights: [],
};
