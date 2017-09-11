import React from 'react';

const img = 'http://www.craziestsportsfights.com/wp-content/uploads/2017/07/mmaimports.png';

function FightBanner({selectedEvent = {}}, link) {
  
  function trailer() {
    if (selectedEvent.eventInfo.trailer_url) {
      return (
        <div className ="fightTrailer">
          <video width="320" height="240" controls>
            <source src={selectedEvent.eventInfo.trailer_url} type="video/mp4"/>
          </video>
        </div>
      )
    }
  }

  if (selectedEvent.eventInfo) {  
    return <div className="fightText">
      <h1>{selectedEvent.eventInfo.base_title}: {selectedEvent.eventInfo.title_tag_line}</h1>
      <img height='100px' width= '100px' src={selectedEvent.eventInfo.secondary_feature_image} />
      </div>
  } else {
    return <div> <img src={img} /></div>
  }
}

export default FightBanner;