import React from 'react';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react';

export default function EventListLoader() {  
  return (
    <Segment>
      <Dimmer active>
        <Loader />
      </Dimmer>
    </Segment>
  );
}
