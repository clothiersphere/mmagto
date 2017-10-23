import React from 'react';

const img = 'http://www.craziestsportsfights.com/wp-content/uploads/2017/07/mmaimports.png';

function FighterGallery({events ={}}) {

  function trailer() {
    if (events.selectedEvent.eventInfo.trailer_url) {
      return (
        <div className ="fightTrailer">
          <video width="320" height="240" controls>
            <source src={events.selectedEvent.eventInfo.trailer_url} type="video/mp4"/>
          </video>
        </div>
      )
    }
  }

  var selectFight = (fight) => {
    events.selectFight(fight)
  };

  

  if (events.selectedEvent.eventInfo) {  
    return (
      <div className="fightText">
        <div className="fightHeader">
          <div className="fightHeader_text">
          <h2 className="eventTitle">{events.selectedEvent.eventInfo.base_title}: {events.selectedEvent.eventInfo.title_tag_line}</h2>
          </div>
          <div className="fighterFacesBox">
            {faceOff(events.selectedEvent)}
          </div>
        </div>
      </div>
    )
  } else {
    return <div></div>
  }
}

export default FighterGallery;

