import React from 'react';

export default function EventItem({event}) {
  const { base_title, title_tag_line } = event.eventInfo
  
  return <div className="eventItemText">{base_title}: {title_tag_line}</div>;
}