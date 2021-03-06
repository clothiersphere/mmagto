import React from 'react';
import PropTypes from 'prop-types';
import HomePane from './WagerPane/HomePane';
import VisitorPane from './WagerPane/VisitorPane';
import WagerPane from './WagerPane';
import FighterStatsPane from './FighterStatsPane';

export default function BettingPane(props) {
  const helpers = {
    showRank(side) {
      const { rank } = side;
      if (rank === null) {
        return <div className="rank"> Rank: Unranked </div>;
      }
      if (rank === 'C') {
        return <div className="rank"> Rank: Champion </div>;
      }
      return <div className="rank"> Rank: #{rank} </div>;
    },
    showNickname(side) {
      if (side.nickname === null) {
        return (
          <div className="nickName">
            Nickname: None
          </div>
        );
      }
      return (
        <div className="nickName">
          Nickname: {side.nickname}
        </div>
      );
    },
    checkWeight(side) {
      if (side.weight_class === null) {
        return 'Null';
      }
      return side.weight_class.replace(/_/g, ' ');
    },
  };
  const { selectedFight, selectFighter } = props;
  
  if (selectedFight[0]) {
    const {
      visitorInfo,
      homeInfo,
      homeFightStats,
      visitorFightStats,
    } = selectedFight[0];

    return (
      <div className="bettingPane">
        <FighterStatsPane fightRecord={homeFightStats} />
        <HomePane {...{ homeInfo, helpers }} />
        <WagerPane {...props} />
        <VisitorPane {...{ visitorInfo, helpers }} />
        <FighterStatsPane fightRecord={visitorFightStats} />
      </div>
    );
  }
  return null;
}

// BettingPane.propTypes = {
//   selectedFight: PropTypes.arrayOf(PropTypes.object).isRequired,
//   other: PropTypes.objectOf(PropTypes.any).isRequired,
// };
