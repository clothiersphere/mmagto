import React from 'react';

export default function FightCard({selectedEvent, selectFight, selectedFight}) {
  if (selectedEvent.length === 0 || selectedFight[0]) {
    return null;
  }
  
  function ConvertName({lastName}) {
    var lastName = lastName.split(' ');
    
    if (lastName.length >= 2) {
      return <div> {lastName[lastName.length-1]} </div> 
    } else {
      return <div> {lastName} </div>
    }
  } 

  return (
    <div className="fightCard">
      {selectedEvent[0].fights.map((fight, key) => {
        console.log(fight, "fightCard")
        return (
          <div className="fightCardFaceOff" key={key} onClick={()=>selectFight(fight)}>
            <div className="small_faceOff_home">
              <img className="faceOff_home small_portrait" src={fight.homeInfo.profile_image}/>
              <div className="home home_faceOff_LastName">
                <ConvertName lastName={fight.homeInfo.last_name} />
              </div>
            </div>
            <div className="small_faceOff_visitor">
              <img className="faceOff_visitor small_portrait" src={fight.visitorInfo.profile_image}/>
              <div className="visitor visitor_faceOff_LastName">
                <ConvertName lastName={fight.visitorInfo.last_name} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}