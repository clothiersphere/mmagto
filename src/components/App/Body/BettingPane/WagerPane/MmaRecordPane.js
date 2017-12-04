import React from 'react';
import MmaRecord from './MmaRecord';

export default function MmaRecordPane({ fightRecord }) {
  const { fights } = fightRecord.fightRecord;
  return (
    <div className="MmaRecordPane">
      {
        fights.map((record, key) => {
         while (key < 10) {
          return <MmaRecord {...{ record, key }} />;
         }
         return null;
         })
      }
    </div>
  );
}
