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

  function faceOff(selectedEvent) {
    return selectedEvent.fights.map((fights, key) => {
      return (
      <div className="faceFaceOff"> 
       <img src={fights.homeInfo.profile_image}/>
       <img src={fights.visitorInfo.profile_image}/>
      </div> 
      )
    })
  }

  if (selectedEvent.eventInfo) {  
    return (
      <div className="fightText">
        <h1>{selectedEvent.eventInfo.base_title}: {selectedEvent.eventInfo.title_tag_line}</h1>
        <div className="fightHeader">
          <img  src={selectedEvent.eventInfo.secondary_feature_image} />
          <div className="fighterFaces">
            {faceOff(selectedEvent)}
          </div>
        </div>
      </div>
    )
  } else {
    return <div> <img src={img} /></div>
  }
}

export default FightBanner;