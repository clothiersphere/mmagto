import React from 'react';

var convertOdds = (odds, wager) => {
  if (isPositive(odds)) {
    return calcFav(odds, wager);
  } else {
    return calcUnderdog(odds, wager);
  }
}

var isPositive = (odds) => {
  if (odds > 0) {
    return false;
  } else {
    return true;
  }
}

var isFavored = (odds) => {
  if (odds > 0) {
    return 'an UNDERDOG';
  } else {
    return 'FAVORED';
  }
}

var calcUnderdog = (odds, wager) => {
  var odds = odds/100;
  
  return wager * odds;
}

var calcFav = (odds, wager) => {
  var odds = odds*(-1);
  odds = 100/odds;

  return wager * odds;
}


var DecisionPane = (props) => {
  const {selectedFighter, selectedFight, wagerValue} = props;

  return (
    <div className="decision_panel">
      {selectedFighter.last_name} is currently {isFavored(selectedFighter.odds)} at {selectedFighter.odds}
        <br/>
      If {selectedFighter.last_name} wins, your bet of ${wagerValue} would
        <br/>
      win you ${convertOdds(selectedFighter.odds, wagerValue)} for a total payout of ${(convertOdds(selectedFighter.odds, wagerValue)) + wagerValue}
    </div>
  )  
}

export default DecisionPane;
