import React from 'react';

export default function HomePane({ homeInfo, helpers }) {
  const {
    first_name,
    last_name,
    wins,
    losses,
    draws,
    left_full_body_image,
  } = homeInfo;


  const { showNickname, showRank, checkWeight } = helpers;
  return (
    <div className="large_faceOff_homeInfo">
      <div className="large_faceOff_homeInfo_name">
        Name: {first_name} {last_name} // eslint-disable-line no-use-before-define
      </div>
      {showNickname(homeInfo)}
      <div className="large_faceOff_homeInfo_weightclass">
        Weightclass: {checkWeight(homeInfo)}
      </div>
      {showRank(homeInfo)}
      <div className="large_faceOff_homeInfo_record">
        Record: {wins}-{losses}-{draws} (W-L-D)
      </div>
      <div className="large_faceOff_home">
        <img alt="" src={left_full_body_image} /> // eslint-disable-line no-use-before-define
      </div>
    </div>
  );
}