import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import MmaRecord from './MmaRecord';

export default function MmaRecordPane({ fightRecord }) {
  const { fights } = fightRecord.fightRecord;
  
  // const columns = [
  //   { Header: 'Name', accessor: 'opponent' },
  //   { Header: 'Result', accessor: 'result' },
  //   { Header: 'Method', accessor: 'method' },
  //   { Header: 'Rnd', accessor: 'round' },
  //   { Header: 'Time', accessor: 'time'},
  // ];

  // return (
  //   <ReactTable
  //     data={fights}
  //     columns={columns}
  //     sortable={false}
  //     showPagination={false}
  //     defaultPageSize={10}
  //     showPageSizeOptions={false}
  //     resizable={false}
  //     expanded={{ 0: true, 2: true }}
  //   />
  // );

  const ShowMmaRecords = () =>
    fights.map((record, key) =>
      <MmaRecord {...{ record }} index={key} />);

  return (
    <div className="MmaRecordPane">
      {ShowMmaRecords()}
    </div>
  );
}
