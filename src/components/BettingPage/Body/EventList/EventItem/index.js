import React from 'react';

export default function EventItem({fight}) {
  const { base_title, title_tag_line } = fight.eventInfo
  return <div> {base_title}: {title_tag_line} </div>;
}