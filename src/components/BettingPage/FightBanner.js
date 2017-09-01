import React from 'react';

const img = 'http://www.craziestsportsfights.com/wp-content/uploads/2017/07/mmaimports.png';

function FightBanner({selectedEvent = {}}, link) {
  
  function trailer() {
    if (selectedEvent.eventInfo.trailer_url) {
      return (
        <div>
          <video width="320" height="240" controls>
            <source src={selectedEvent.eventInfo.trailer_url} type="video/mp4"/>
          </video>
        </div>
      )
    }
  }

  if (selectedEvent.eventInfo) {  
    return <div className="fightText">
      <h2>{selectedEvent.eventInfo.base_title}: {selectedEvent.eventInfo.title_tag_line}</h2>
      <img src={selectedEvent.eventInfo.feature_image} />
      {trailer()}
      </div>
  } else {
    return <div> <img src={img} /></div>
  }
}

export default FightBanner;