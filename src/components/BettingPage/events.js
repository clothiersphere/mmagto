import React from 'react';

function Events({events = {}}) {
  
  function pushbutton(e) {
    alert('it work')
    e.preventDefault()
  }

  if (events.fights[0]) { 
    return (
      <div className="eventBox">
      {
        events.fights.map((event,key) => {
          console.log(event[0]['banner'], "hi")
              return <div key={key}>
              <div>
              {banner.$.htm}
              {banner.$.vtm}
              <h1>hi</h1>
              </div>
              
            </div>
          })
        })

      }
      </div>
    )
  } else {
    return <div><h1>..loading</h1></div>
  }  
}

export default Events;