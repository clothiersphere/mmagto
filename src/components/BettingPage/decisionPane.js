import React from 'react';

var convertOdds = (odds, wager) => {
  if (isPositive(odds)) {
    return calcFav(odds, wager);
  } else {
    return calcUnderdog(odds, wager);
  }
  return;
}

var isPositive = (odds) => {
  if (odds > 0) {
    return false;
  } else {
    return true;
  }
  return;
}

var isFavored = (odds) => {
  if (odds > 0) {
    return 'an UNDERDOG';
  } else {
    return 'FAVORED';
  }
  return;
}

var isFavored2 = (selectedFight, selectedFighter) => {
  const { homeInfo, visitorInfo } = selectedFight
  const { odds } = selectedFighter; 

  const smaller = Math.min(homeInfo.odds, visitorInfo.odds);

  console.log(homeInfo.odds, visitorInfo.odds, odds, smaller, "odds")

  if (odds === smaller) {
    return 'FAVORITE';
  } 
  return 'UNDERDOG';
}

var calcUnderdog = (odds, wager) => {
  var odds = odds/100;
  return wager * odds
}

var calcFav = (odds, wager) => {
  var odds = odds*(-1);
  odds = 100/odds;
  return wager * odds
}

var oddsToDec = (odds) => {
  var odds = odds;
  
  if (odds > 1) {
    odds = odds/100;
    
  } else {
    odds = odds * (-1)
    odds = 100/odds
  }

  return (odds + 1).toFixed(2)
}

var impliedProb = (odds) => {
  var odds = odds;
  
  if (odds > 1) {
    odds = odds/100;
    
  } else {
    odds = odds * (-1)
    odds = 100/odds
  }

  return Math.round(odds * 100);
}

var DecisionPane = (props) => {
  const {selectedFighter, selectedFight, wagerValue} = props;
  
  return (
    <div className="decision_panel">
      {selectedFighter.last_name} is currently {isFavored2(selectedFight, selectedFighter)} at {selectedFighter.odds}.
      <br/>
      {selectedFighter.last_name}'s implied odds to win are {impliedProb(selectedFighter.odds)}%.
      <br/>
      If {selectedFighter.last_name} wins, your bet of ${wagerValue} would
        <br/>
      win you ${convertOdds(selectedFighter.odds, wagerValue)} for a total payout of ${(convertOdds(selectedFighter.odds, wagerValue)) + wagerValue}
    </div>
  )  
}

export default DecisionPane;
