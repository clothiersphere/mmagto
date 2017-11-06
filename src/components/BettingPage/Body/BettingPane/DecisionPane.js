import React from 'react';

function isPositive(odds) {
  if (odds > 0) {
    return false;
  }
  return true;
}

function calcUnderdog(odds, wager) {
  var odds = odds/100;
  return parseInt(wager * odds);
}

function calcFav(odds, wager) {
  var odds = odds * (-1);
  odds = 100/odds;
  return parseInt(wager * odds);
}

function convertOdds(odds, wager) {
  if (isPositive(odds)) {
    return calcFav(odds, wager);
  }
  return calcUnderdog(odds, wager);
}

function isFavored(selectedFight, selectedFighter) {
  const { homeInfo, visitorInfo } = selectedFight;
  const { odds } = selectedFighter;
  const smaller = Math.min(homeInfo.odds, visitorInfo.odds);

  if (parseInt(odds) === parseInt(smaller)) {
    return 'FAVORITE';
  }
  return 'UNDERDOG';
}

function oddsToDec(odds) {
  var odds = odds;
  if (odds > 1) {
    odds = odds / 100;
  } else {
    odds = odds * (-1);
    odds = 100 / odds;
  }
  return odds + 1;
}

function impliedProb(odds) {
  var odds = odds;
  if (odds > 1) {
    odds = 100/(parseInt(odds) + 100) 
  } else {
    odds = odds * (-1)
    odds = 100/odds
  }
  return (odds * 100).toFixed(2)
}

function totalPayout(odds, wagerValue) { 
  var winMoney = convertOdds(odds, wagerValue);
  var wagerValue = parseInt(wagerValue);
  return winMoney + wagerValue;
}

export default function DecisionPane({ selectedFighter, selectedFight, wagerValue }) {
  if (selectedFighter[0]) {
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
    );
  }
  return null;
}
