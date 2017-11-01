import React from 'react';
import PropTypes from 'prop-types';

export default function VisitorPane({ visitorInfo, helpers }) {
  const {
    first_Name,
    last_Name,
    wins, losses,
    draws,
    right_full_body_image,
  } = visitorInfo;

  const { showNickname, showRank, checkWeight } = helpers;
  return (
    <div className="large_faceOff_visitorInfo">
      <div className="large_faceOff_visitorInfo_name">
        Name: {first_Name} {last_Name}
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

VisitorPane.propTypes = {
  visitorInfo: PropTypes.shape({
    first_Name: PropTypes.string,
    last_Name: PropTypes.string,
    wins: PropTypes.number,
    losses: PropTypes.number,
    draws: PropTypes.number,
    right_full_body_image: PropTypes.string,
  }).isRequired,
  helpers: PropTypes.shape({
    showNickname: PropTypes.func,
    showRank: PropTypes.func,
    checkWeight: PropTypes.func,
  }).isRequired,
};
