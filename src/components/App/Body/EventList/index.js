import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link, browerHistory } from 'react-router-dom';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import EventItem from './EventItem';
import EventListLoader from './EventListLoader';

export default class EventList extends Component {
  handleClick(event, id) {
    this.props.selectEvent(event);
    this.props.history.push('/fightCard');
  }

  render() {
    const { fights } = this.props;
    const eventItem = (event) => {
      const { base_title, title_tag_line } = event.eventInfo;
      const shortUrl = base_title.replace(/ /g, '') + title_tag_line.replace(/ /g, '');
      return (
        <div className="eventItemText">
          {base_title}: {title_tag_line}
        </div>
      );
    };

    const links = fights.map((event, index) => {
      if (event.eventInfo) {
        return (
          <li
            className="eventItem"
            onClick={() => this.handleClick(event, event.eventInfo.id)}
            key={index}
          >
            { eventItem(event) }
          </li>
        );
      }
      return null;
    });

    if (fights.length === 0) {
      return <EventListLoader />;
    }


    return (
      <ul className="eventList">
        {links}
      </ul>
    );
  }
}

// EventList.propTypes = {
//   fights: PropTypes.arrayOf(PropTypes.object),
//   selectEvent: PropTypes.func.isRequired,
// };

// EventList.defaultProps = {
//   fights: [],
// };
