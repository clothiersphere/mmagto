import React from 'react';

export default function MmaRecord(props) {
  const { record, index } = props;
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
  const shortMethod = method.split(' ');
  if (shortMethod[0] === 'TKONA/A)') {
    shortMethod[0] = 'TKO N/A';
  }
  if (shortMethod[0] === 'Decision') {
    shortMethod[0] = 'Dec';
  }
  if (shortMethod[0] === 'Submission') {
    shortMethod[0] = 'Sub';
  }
  const ShowMmaRecord = () => {
    if (index < 10) {
      return (
        <div className="MmaRecord" key={index}>
          {opponent} {result} {shortMethod[0]} Rd:{round}
        </div>
      );
    }
    return null;
  };

  return ShowMmaRecord();
}
