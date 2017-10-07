import React from 'react';

var DecisionPane = (fighter) => {

  const {selectedFighter} = fighter;
  
  console.log(fighter, "fighter")

  return (
    <div className="decision_panel">
      {selectedFighter.last_name} is currently at {selectedFighter.odds}
      <br/>
      If they win, your bet of 100 dollars would
      <br/>
      win you ${selectedFighter.odds} for a total payout of ${selectedFighter.odds}
    </div>
  )
}

var isFavored = (odds) => {
  //check if odd is positive or negative.
  if (odds > 0) {
    return true;  
  } else {
    return false;
  }
  
}

export default DecisionPane;