import React from 'react';
import PropTypes from 'prop-types';

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
        Name: {first_name} {last_name}
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
        <img alt="" src={left_full_body_image} />
      </div>
    </div>
  );
}

HomePane.propTypes = {
  homeInfo: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
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
