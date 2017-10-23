import React from 'react';

var convertName = (name) => {
  var name = name.split(' ');
  if (name.length >= 2) {
    return name[name.length-1];
  } else {
    return name;
  }
};

function FightCard(selectedEvent) {
    console.log(selectedEvent, "selectedEvent in fightcard")
    return <div> hi</div>
    // return selectedEvent.fights.map((fight, key) => {
      
    //   return (
    //     // <div className="small_faceOff_container" key={key} onClick={()=>selectFight(fight)}>
    //     <div className="small_faceOff_container" key={key} >
    //       <div className="small_faceOff_home">
    //         <img className="faceOff_home small_portrait" src={fight.homeInfo.profile_image}/>
    //         <div className="home home_faceOff_LastName">
    //           {convertName(fight.homeInfo.last_name)}
    //         </div>
    //       </div>
    //       <div className="small_faceOff_visitor">
    //         <img className="faceOff_visitor small_portrait" src={fight.visitorInfo.profile_image}/>
    //         <div className="visitor visitor_faceOff_LastName">
    //           {convertName(fight.visitorInfo.last_name)}
    //         </div>
    //       </div>
    //     </div>
    //   )
    // })
  }

  export default FightCard;