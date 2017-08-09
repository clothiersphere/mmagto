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
        
        events.fights[0][0][0]['banner'].map((event,key) => {

          return <div key={key}>
            <div>
              
              <button type="button" onClick={pushbutton}></button>
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

export default Events;