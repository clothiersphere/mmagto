import React from 'react';
import * as actions from '../../actions';

function Events({events = {}}) {
  
  function displayBanner(events) {
    return events.fights.map((fight,key) => {
      return <div className="events" key={key} onClick={()=> events.setEvent(fight)}> {
        fight['banner'].map((fights, key) => {
          return (
            <div className="bannerTitle" key={key}>
              {fights.$.vtm} {fights.$.htm}
            </div>
          )
        })
      }
      </div>
    });
  }

  if (events.fights[0]) {
    if (events.fights.join('') === 'failed') {
      return (
        <div>
          <h1> MMA odds are down. Please check back tomorrow.</h1> 
        </div>
      )
    }

    return (
      <div>
        <div className="displayBanner">
          {displayBanner(events)}
        </div>
      </div>
    )
  } else {
    return <div><h1>..loading vegas odds</h1></div>
  }
}
export default Events;