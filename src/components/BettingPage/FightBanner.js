import React from 'react';

const img = 'http://www.craziestsportsfights.com/wp-content/uploads/2017/07/mmaimports.png';

// if (selectedEvent) {
//   console.log(selectedEvent, "selectedEvent")
// }

function FightBanner({selectedEvent = {}}, link) {
  console.log(selectedEvent, "SE")  
  if (selectedEvent.eventInfo) {  
    return <div className="fightText"> 
      <img src={selectedEvent.eventInfo.feature_image} />
      <br/>
      {selectedEvent.eventInfo.subtitle} {selectedEvent.eventInfo.base_title} {selectedEvent.eventInfo.title_tag_line}
    </div>
  } else {
    return <div> <img src={img} /></div>
  }
}

export default FightBanner;