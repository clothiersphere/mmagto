import React from 'react';
import axios from 'axios';


function BettingPane({selectedEvent={}}) {
  
  function displayEvent(selectedEvent) {
    return selectedEvent.fights.map((fight, key) => {
      function convertOdds(number) {

        if (number > 0) {
          var udParse = number.substr(number.indexOf('+')+1)
          return <div> $100 wins you ${udParse} </div>  
        } else {
          

          var favCalc = (number*(-1))/100
          favCalc = Math.round(100/favCalc)

          console.log(favCalc, "favCalc")

          return <div> $100 wins you ${favCalc} </div>
        }

        
      }

      console.log(fight, "fight")
      return (
        <div className="bettingPane" key={key}>
          <div className="container">
            <div className="stats"> 
              {fight.home} 
              <br/>
              {fight.homeInfo.wins}-{fight.homeInfo.losses}-{fight.homeInfo.draws}
            </div>
            <img className="portrait" src={fight.homeInfo.thumbnail}/> 
          </div> 
          <div className="container">
              <div className="stats"> 
                {fight.visitor} 
                <br/>
                {fight.visitorInfo.wins}-{fight.visitorInfo.losses}-{fight.visitorInfo.draws}
              </div>
              <img className="portrait" src={fight.visitorInfo.thumbnail}/>
          </div>
          <div className="container">
            homeOdds:{fight.homeOdds}
            {convertOdds(fight.homeOdds)}
            visitorOdds:{fight.visitorOdds}
            {convertOdds(fight.visitorOdds)}
            

          </div>

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