import React from 'react';
import * as actions from '../../actions';
import CircularProgress from 'material-ui/CircularProgress';
import AppBar from 'material-ui/AppBar';
import { indigo500, blue500, lightBlue500, cyan500, indigoA100, blueA100, lightBlueA100, cyan50A100, teal500, green500, lightGreen500, lime500 } from 'material-ui/styles/colors';

function Header({events = {}}) {

  const colorPalette = [blue500, lightBlue500, cyan500, indigoA100, blueA100, lightBlueA100, cyan50A100, teal500, green500, lightGreen500, lime500];

  class ShowEventLists extends React.Component {
    
    showEventListMain = (events) => {
      if (events.selectedEvent.length === 0) {
        return events.fights.map((fight, key) => {
          return (
            <div className="events layFlat"
              key={key} 
              onClick={()=> events.setEvent(fight)}
              onMouseOver={()=> console.log(fight.eventInfo.secondary_feature_image, "fight")}
            >
            <div className="events fightTiles"
              style={{backgroundColor:colorPalette[key]}}
            >
            </div>
              {fight.eventInfo.base_title}: {fight.eventInfo.title_tag_line}
            </div>
          )
        })
      }
    }

    showEventListMin = (events) => {
      var currSelectedEvent;
      if (events.selectedEvent.eventInfo) {
        currSelectedEvent = events.selectedEvent.eventInfo.id;
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
            return (
              <div className="events fightTiles" 
                style={{backgroundColor:colorPalette[key]}}
                key={key}
                onClick={()=> events.setEvent(fight)}
              >
              </div>
            )
          }
        })
      }
    }

    render() {
      return (
        <div>  
          <div className="eventListingSplash">
            {this.showEventListMain(events)}
          </div>
            <div className="layFlat">
            {this.showEventListMin(events)}
          </div>
        </div>
      )
    }
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
      <div className="displayBanner">
        <ShowEventLists />
      </div>
    )
  } else {
    return (
      <div className="displayBanner">
        <div className="splash"><CircularProgress />loading vegas odds</div>
      </div>
    )
  }
}

export default Header;
