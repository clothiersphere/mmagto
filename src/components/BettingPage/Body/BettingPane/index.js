import React from 'react';
import PropTypes from 'prop-types';
import HomePane from './HomePane';
import VisitorPane from './VisitorPane';
import WagerPane from './WagerPane';

export default function BettingPane({ selectedFight, other }) {
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
  const { selectFighter } = other;
  if (selectedFight[0]) {
    const { visitorInfo, homeInfo } = selectedFight[0];
    return (
      <div className="bettingPane">
        <HomePane {...{ homeInfo, helpers }} />
        <WagerPane
          {...{
            other,
            visitorInfo,
            homeInfo,
            selectFighter,
          }}
        />
        <VisitorPane {...{ visitorInfo, helpers }} />
      </div>
    );
  }
  return null;
}

BettingPane.propTypes = {
  selectedFight: PropTypes.arrayOf(PropTypes.object).isRequired,
  other: PropTypes.objectOf(PropTypes.any).isRequired,
};

