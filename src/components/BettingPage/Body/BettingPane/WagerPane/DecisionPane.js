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
  odds = 100 / odds;
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

  if (parseInt(odds, 10) === parseInt(smaller, 10)) {
    return 'the FAVORITE';
  }
  return 'an UNDERDOG';
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
  const winMoney = convertOdds(odds, wagerValue);
  const wagerValueParsed = parseInt(wagerValue);
  return winMoney + wagerValueParsed;
}

export default function DecisionPane({ selectedFighter, selectedFight, wagerValue }) {
  if (selectedFighter[0] && wagerValue) {
    selectedFight[0].homeInfo.odds = selectedFight[0].homeOdds;
    selectedFight[0].visitorInfo.odds = selectedFight[0].visitorOdds;
    const fighter = selectedFighter[0];

    return (
      <div className="decision_panel">
        {fighter.last_name} is currently {fighter.odds} {isFavored(selectedFight[0], fighter)}.
        <br/>
        Implied odds to win are {impliedProb(fighter.odds)}%.
        <br/>
        If {fighter.last_name} wins, your bet of ${wagerValue} would
        <br/>
        win you ${convertOdds(fighter.odds, wagerValue).toFixed(2)} for a total payout of ${totalPayout(fighter.odds, wagerValue)}
      </div>
    );
  }
  return null;
}
