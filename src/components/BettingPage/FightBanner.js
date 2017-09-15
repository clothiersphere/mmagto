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
        <div className="small_faceOff_container" key={key}>
          <div className="small_faceOff_visitor">
            <img className="faceOff_visitor small_portrait" src={fights.visitorInfo.profile_image}/>
            <div className="visitor visitor_faceOff_LastName">
              {fights.visitorInfo.last_name}
            </div>
          </div>
          <div className="small_faceOff_home">
            <img className="faceOff_home small_portrait" src={fights.homeInfo.profile_image}/>
            <div className="home home_faceOff_LastName">
              {fights.homeInfo.last_name}
            </div>
          </div>
        </div>
      )
    })
  }

  if (selectedEvent.eventInfo) {  
    return (
      <div className="fightText">
        <h2 className="eventTitle">{selectedEvent.eventInfo.base_title}: {selectedEvent.eventInfo.title_tag_line}</h2>
        <div className="fightHeader">
          <div className="fighterFacesBox">
            {faceOff(selectedEvent)}
          </div>
        </div>
      </div>
    )
  } else {
    return <div> <img src={img} /></div>
  }
}

// <img  className="fightBanner" src={selectedEvent.eventInfo.secondary_feature_image} />

export default FightBanner;

