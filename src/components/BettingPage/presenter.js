import React from 'react';

function BettingPage(events) {

function pushbutton(e) {
  alert('it work')
  e.preventDefault()
}
  if (events.fights[0]) {
    return (
      <div className="eventBox"> 
      {
        events.fights.map((event,key) => {
          console.log(event, "event")
          return <div key={key}>
          <div>
            {event.banner[0].$.htm}
            {event.banner[0].$.vtm}
            {event.banner[1].$.htm}
            {event.banner[1].$.vtm}
          <button type="button" onClick={pushbutton}>
          </button>
          </div>
          </div>
        })
        

      }
      </div>
    )
  } else {
    return <div><h1>..loading</h1></div>
  }  
}

export default BettingPage;
