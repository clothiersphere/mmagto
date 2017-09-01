import React from 'react';
import axios from 'axios';


function BettingPane({selectedEvent={}}) {
  
  function displayEvent(selectedEvent) {
    return selectedEvent.fights.map((fight, key) => {
      return (
        <div key={key}>
          {fight.vtm}
        </div>  
      )
    })
  }

  if (selectedEvent.fights) {
    return (
     <div>
      {displayEvent(selectedEvent)}
     </div>
    )
  } else {
    return <div> hi </div>
  }
} 

export default BettingPane;