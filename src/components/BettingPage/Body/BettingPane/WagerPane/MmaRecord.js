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

  return (
    <div className="MmaRecord">
      {opponent} {method} {result}
    </div>
  );
}
