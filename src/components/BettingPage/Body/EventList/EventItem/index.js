import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function EventItem({ event }) {
  const { base_title, title_tag_line } = event.eventInfo;
  const titleToUrl = base_title.replace(/ /g,'')+title_tag_line.replace(/ /g,'');
  return (
    <div className="eventItemText">
      <Link to={`/eventList/${titleToUrl}`}>{base_title}:{title_tag_line}</Link>
    </div>
  );
}
