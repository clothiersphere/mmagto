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
          return <div> $100 wins you ${favCalc} </div>
        }
      }

      console.log(fight, "fight")
     
      // return (
      //   <div className="bettingPane" key={key}>
      //     <div className="container">
      //       <img className="portrait" src={fight.homeInfo.thumbnail}/> 
      //       <div className="stats"> 
      //         {fight.homeInfo.first_name}
      //         <br/>
      //         {fight.homeInfo.last_name}
      //         <br/>
      //         {fight.homeInfo.wins}-{fight.homeInfo.losses}-{fight.homeInfo.draws}
      //       </div>
            
      //       <div className="bet">
      //         <form>
      //           <input type="text"/>
      //           <input type="submit"/>
      //         </form>              
      //       </div>
      //     </div> 
      //     <div className="container">
      //         <img className="portrait" src={fight.visitorInfo.thumbnail}/>
      //         <div className="stats"> 
      //           {fight.visitorInfo.first_name}
      //           <br/>
      //           {fight.visitorInfo.last_name}
      //           <br/>
      //           {fight.visitorInfo.wins}-{fight.visitorInfo.losses}-{fight.visitorInfo.draws}
      //         </div>
              
      //     </div>
      //   </div>  
      // )
      return (
        <div className="bettingPane" key={key}>
          <div className="homeFighter">
            <div className="fighter portrait">
              <img className="portrait" src={fight.homeInfo.thumbnail}/>
            </div>
            <div className="fighter name">
              {fight.homeInfo.first_name} {fight.homeInfo.last_name}
              <br/>
              {fight.homeInfo.wins}-{fight.homeInfo.losses}-{fight.homeInfo.draws}
            </div>
            <div className="fighter odds">
              {convertOdds(fight.homeOdds)}
            </div>
            <div className="fighter slider check">
              <form className="payoutSlider">
                <input type="slider"/>
              </form>
              <form className="winnerCheck">
                <input type="checkbox"/>
              </form>
            </div>
          </div>
          <div className="visitorFighter">
            <div className="fighter portrait">
              <img className="portrait" src={fight.visitorInfo.thumbnail}/>
            </div>
            <div className="fighter name">
              {fight.visitorInfo.first_name} {fight.visitorInfo.last_name}
              <br/>
              {fight.visitorInfo.wins}-{fight.visitorInfo.losses}-{fight.visitorInfo.draws}
            </div>
            <div className="fighter odds">
              {convertOdds(fight.visitorOdds)}
            </div>
            <div className="fighter slider check">
              <form className="payoutSlider">
                <input type="slider"/>
              </form>
              <form className="winnerCheck">
                <input type="checkbox"/>
              </form>
            </div>
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