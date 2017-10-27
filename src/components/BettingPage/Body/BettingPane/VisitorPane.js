import React from 'react';

export default function VisitorPane({visitorInfo, helpers}) {
  const { first_name, last_name, wins, losses, draws, right_full_body_image } = visitorInfo;
  const { showNickname, showRank, checkWeight } = helpers;
  
  return (
    <div className="large_faceOff_visitorInfo">
      <div className="large_faceOff_visitorInfo_name">
        Name: {first_name} {last_name}
      </div>
      {showNickname(visitorInfo)}
      <div className="large_faceOff_visitorInfo_weightclass">
        Weightclass: {checkWeight(visitorInfo)}
      </div>
      {showRank(visitorInfo)}
      <div className="large_faceOff_visitorInfo_record">
        Record: {wins}-{losses}-{draws} (W-L-D)
      </div>
      <div className="large_faceOff_home">
        <img src={right_full_body_image} />
      </div>
    </div>
  );
}