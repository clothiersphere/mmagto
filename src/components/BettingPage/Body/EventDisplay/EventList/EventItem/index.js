import React from 'react';

function EventItem({ fight }) {
  return <div> {fight.eventInfo.base_title}: {fight.eventInfo.title_tag_line} </div>
}

export default EventItem;