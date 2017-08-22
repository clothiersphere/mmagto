import React from 'react';
import * as actions from '../../actions';

function Events({events = {}}) {
  
  function setEvent(arg, key) {
    console.log(arg, key, "key")
  }

  function fightFight(events) {
    return events.fights.map((events,key) => {
      return <div className="events" key={key} onClick={() => setEvent(events, key)}> {
        events[0]['banner'].map((fight, key) => {
          return (
            <div key={key}  >
              {fight.$.vtm}
              {fight.$.htm}
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