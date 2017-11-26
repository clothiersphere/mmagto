import React from 'react';
import MmaRecordPane from './MmaRecordPane';

export default function FighterStatsPane(fightRecord) {
  return (
    <div>
      <MmaRecordPane {...{ fightRecord }} />
    </div>
  );
}
