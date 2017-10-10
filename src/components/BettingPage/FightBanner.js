import React from 'react';
import AppBar from 'material-ui/AppBar';

const img = 'http://www.craziestsportsfights.com/wp-content/uploads/2017/07/mmaimports.png';

function FightBanner({events ={}}) {

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

  var convertName = (name) => {
    var name = name.split(' ');
    if (name.length >= 2) {
      return name[name.length-1];
    } else {
      return name;
    }
  };

  var selectFight = (fight) => {
    events.selectFight(fight)
  };

  function faceOff(selectedEvent) {
    return selectedEvent.fights.map((fight, key) => {
      
      return (
        <div className="small_faceOff_container" key={key} onClick={()=>selectFight(fight)}>
          <div className="small_faceOff_home">
            <img className="faceOff_home small_portrait" src={fight.homeInfo.profile_image}/>
            <div className="home home_faceOff_LastName">
              {convertName(fight.homeInfo.last_name)}
            </div>
          </div>
          <div className="small_faceOff_visitor">
            <img className="faceOff_visitor small_portrait" src={fight.visitorInfo.profile_image}/>
            <div className="visitor visitor_faceOff_LastName">
              {convertName(fight.visitorInfo.last_name)}
            </div>
          </div>
        </div>
      )
    })
  }

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

export default FightBanner;

