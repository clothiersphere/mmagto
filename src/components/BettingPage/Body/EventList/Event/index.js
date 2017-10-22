import React from 'react';

const Event = ({fight}) => { 
  console.log(fight, "fightevent")
  // console.log(fight.fight.eventInfo.base_title, "event")

  // console.log(fight.eventInfo.base_title, "eventighft")
  return <div> {fight.eventInfo.base_title}: {fight.eventInfo.title_tag_line} </div>
}

export default Event;
