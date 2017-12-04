import React from 'react';

export default function MmaRecord({ record }) {
  
  const { 
    method,
    opponent,
    round,
    time,
    name,
  } = record;

  let { result } = record;

  if (result === 'win') {
    result = 'W';
  }

  if (result === 'loss') {
    result = 'L';
  }

  const shortMethod = method.split(' ')

  if (shortMethod[0] === 'TKONA/A)') {
    shortMethod[0] = 'TKO N/A';
  }

  if (shortMethod[0] === 'Decision') {
    shortMethod[0] = 'Dec';
  }

  return (
    <div className="MmaRecord">
      {opponent} {result} {shortMethod[0]} Rd:{round}
    </div>
  );
}
