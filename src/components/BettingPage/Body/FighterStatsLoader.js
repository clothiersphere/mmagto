import React from 'react';

import { Loader } from 'semantic-ui-react';

const FighterStatsLoader = () => (
  <Loader active indeterminate inline="centered">
    <p> Querying Fighter Stats </p>
  </Loader>
);

export default FighterStatsLoader;
