import React, { Component } from 'react';
import Event from './Event';

export default class EventList extends Component {


    constructor(props) {
      super(props)
    }

    state = {
      img: '',
      title1: '',
      title2: '',
    }
    
    showEventListMain = (events) => {
      if (events.length >= 1) {
      console.log(events, "events")
        events.fights.map((fight, key) => {
          return (
            <div className="events layFlat"
              key={key} 
              onClick={()=> events.setEvent(fight)}
              // onMouseOver={()=> this.setState({img:fight.eventInfo.secondary_feature_image})}
            >
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
      return (
        <div> {this.state.title1} {this.state.title2} </div>
      )
    }




    // render() {
    //   var events = this.props
    //   // const { events } = this.p
    //   return (
    //     <div className="displayBanner">
    //       <div className="eventListingSplash">
    //         {this.showEventListMain(events)}
    //         <img className="eventBanner" src={this.state.img}/>
    //       </div>
    //       <div className="layFlat">
    //         {this.showEventListButton(events)}
    //         {this.showEventListMin(events)}
    //       </div>
    //     </div>
    //   )
    // }
    render() {
    
      const { event } = this.props;
      console.log(event, "EventList")

      return (
      <ul>
        {event.map(function(fight, index) {
          return <li key= {index}><Event fight={fight}/></li>
        })}
      </ul>
      )
    }
}
