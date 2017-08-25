import React from 'react';
import * as actions from '../../actions';

function Events({events = {}}) {
  function fightFight(events) {
    return events.fights.map((fight,key) => {
      return <div className="events" key={key} onClick={()=> events.setEvent(fight)}> {
        fight[0]['banner'].map((fights, key) => {
          return (
            <div key={key}  >
              {fights.$.vtm}
              {fights.$.htm}
            </div>
          )
        })
      }
      </div>
    }) 
  }

  if (events.fights[0]) { 
    return (
    <div>
      <div className="fightFight"> 
        {fightFight(events)} 
      </div>
    </div>
    )
  } else {
    return <div><h1>..loading</h1></div>
  }  
}

export default Events;