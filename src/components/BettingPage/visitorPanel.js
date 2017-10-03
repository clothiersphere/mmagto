import React from 'react';

function visitorPanel() {
  return (
    <div className="large_faceOff_visitorInfo">
        <div className="large_faceOff_visitorInfo_name">
          Name: {events.selectedFight.first_name} {events.selectedFight.last_name}
        </div>
        {showNickname(visitorInfo)}
        <div className="large_faceOff_visitorInfo_weightclass">
          Weightclass: {events.selectedFight.weight_class.replace(/\_/g, " ")}
        </div>
        {showRank(visitorInfo)}
        <div className="large_faceOff_visitorInfo_record">
          Record: {events.selectedFight.wins}-{events.selectedFight.losses}-{events.selectedFight.draws} (W-L-D)
        </div>
      </div>
  )
}
export default visitorPanel;