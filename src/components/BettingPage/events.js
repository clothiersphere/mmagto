import React from 'react';
import * as actions from '../../actions';
import CircularProgress from 'material-ui/CircularProgress';
import { indigo500, blue500, lightBlue500, cyan500, indigoA100, blueA100, lightBlueA100, cyan50A100, teal500, green500, lightGreen500, lime500 } from 'material-ui/styles/colors';

function Events({events = {}}) {

  const colorPalette = [blue500, lightBlue500, cyan500, indigoA100, blueA100, lightBlueA100, cyan50A100, teal500, green500, lightGreen500, lime500];
  
  function displayBanner(events) {
    var currSelectedEvent;
    if (events.selectedEvent) {
      if (events.selectedEvent.eventInfo) {
        currSelectedEvent = events.selectedEvent.eventInfo.id;
      }
    }

    return events.fights.map((fight,key) => {
      if (fight.eventInfo.id === currSelectedEvent) {
        return (
          <div className="events fightTiles" 
            style={{backgroundColor:colorPalette[key], border:'0.5px solid black'}} 
            key={key} 
            onClick={()=> events.setEvent(fight)}
          >
          </div>
        )
      } else {       
        console.log(fight['banner'][1]['$'].vtm);
        console.log(fight.eventInfo.id, "fight")
        return (
          <div className="events fightTiles" 
            style={{backgroundColor:colorPalette[key]}} 
            key={key} 
            onClick={()=> events.setEvent(fight)}
          >
          </div>
        )
      }
    });
  }

  if (events.fights[0]) {
    if (events.fights.join('') === 'failed') {
      return (
        <div>
          <h1> MMA odds are down. Please check back later.</h1> 
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
    return <div><CircularProgress />loading vegas odds</div>
  }
}
export default Events;