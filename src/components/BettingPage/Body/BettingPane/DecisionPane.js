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
  return;
}

var isFavored = (selectedFight, selectedFighter) => {
  const { homeInfo, visitorInfo } = selectedFight
  const { odds } = selectedFighter; 
  const smaller = Math.min(homeInfo.odds, visitorInfo.odds);

  if (parseInt(odds) === parseInt(smaller)) {
    return 'FAVORITE';
  } else {
    return 'UNDERDOG';
  }
}

var calcUnderdog = (odds, wager) => {
  var odds = odds/100;
  return parseInt(wager * odds);
}

var calcFav = (odds, wager) => {
  var odds = odds*(-1);
  odds = 100/odds;
  return parseInt(wager * odds);
}

var oddsToDec = (odds) => {
  var odds = odds;
  
  if (odds > 1) {
    odds = odds/100;
    
  } else {
    odds = odds * (-1)
    odds = 100/odds
  }

  return odds + 1;
}

var impliedProb = (odds) => {

  console.log(odds)
  var odds = odds;

  if (odds > 1) {
    odds = 100/(parseInt(odds) + 100)
    
    
  } else {
    odds = odds * (-1)
    odds = 100/odds
    
  }
  return (odds * 100).toFixed(2)
}

var totalPayout = (odds, wagerValue) => {
  
  var winMoney = convertOdds(odds, wagerValue);
  var wagerValue = parseInt(wagerValue);
  return winMoney + wagerValue;
}

var DecisionPane = (props) => {
  const {selectedFighter, selectedFight, wagerValue} = props;

  return (
    <div className="decision_panel">
      {selectedFighter.last_name} is currently a {selectedFighter.odds} {isFavored(selectedFight, selectedFighter)}.
      <br/>
      Implied odds to win are {impliedProb(selectedFighter.odds)}%.
      <br/>
      If {selectedFighter.last_name} wins, your bet of ${wagerValue} would
        <br/>
      win you ${convertOdds(selectedFighter.odds, wagerValue).toFixed(2)} for a total payout of ${totalPayout(selectedFighter.odds, wagerValue)}
    </div>
  )  
}

export default DecisionPane;
