import React from 'react';
import * as actions from '../../actions';
import Sidebar from './Sidebar';
import CircularProgress from 'material-ui/CircularProgress';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import { indigo500, blue500, lightBlue500, cyan500, indigoA100, blueA100, lightBlueA100, cyan50A100, teal500, green500, lightGreen500, lime500 } from 'material-ui/styles/colors';

function Header({events = {}}) {

  const colorPalette = [blue500, lightBlue500, cyan500, indigoA100, blueA100, lightBlueA100, cyan50A100, teal500, green500, lightGreen500, lime500];

  class ShowEventLists extends React.Component {

    constructor(props) {
      super(props)
    }

    componentDidMount() {

    }

    state = {
      img: '',
      title1: '',
      title2: '',
    }
    
    showEventListMain = (events) => {
      if (events.selectedEvent.length === 0) {
        return events.fights.map((fight, key) => {
          return (
            <div className="events layFlat"
              key={key} 
              onClick={()=> events.setEvent(fight)}
              onMouseOver={()=> this.setState({img:fight.eventInfo.secondary_feature_image})}
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
                onMouseOver={()=> this.setState({title1:fight.eventInfo.base_title, title2:fight.eventInfo.title_tag_line})}
                key={key} 
                onClick={()=> events.setEvent(fight)}
              >
              </div>
              )
          } else {
            return (
              <div className="events fightTiles" 
                style={{backgroundColor:colorPalette[key]}}
                onMouseOver={()=> this.setState({title1:fight.eventInfo.base_title, title2:fight.eventInfo.title_tag_line})}
                key={key}
                onClick={()=> events.setEvent(fight)}
              >
              </div>
            )
          }
        })
      }
    }

    showEventListButton = (events) => {
      if (events.selectedEvent.eventInfo) {
        return ( 
          <Sidebar props={events}/>
        )
        // return (
        //   <div>
        //     <FlatButton 
        //       label="Back to Event Listing" 
        //       primary={true}
        //       onClick={()=> events.eventsReset()}
        //     />
        //   </div>
        // )
      }
    }

    showEventInfo = () => {
      // if (this.state.title1)
        return (
          <div> {this.state.title1} {this.state.title2} </div>
        // ) else {
        //   return 
        // }
        )
    }

    render() {
      return (
        <div className="displayBanner">
          <div className="eventListingSplash">
            {this.showEventListMain(events)}
            <img className="eventBanner" src={this.state.img}/>
          </div>
          <div className="layFlat">
            {this.showEventListButton(events)}
            {this.showEventListMin(events)}
            {this.showEventInfo()}
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
    return <ShowEventLists />
  } else {
    return <div className="splash displayBanner"><CircularProgress />loading vegas odds</div>

  }
}

export default Header;
