import React from 'react';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react';

export default function EventListLoader() {  
  return (
    <div className="eventListLoader">
      <Segment>
        <Dimmer active>
          <Loader indeterminate>Getting Odds</Loader>
        </Dimmer>
        <Image src="http://1.semantic-ui.com/images/wireframe/paragraph.png" />
      </Segment>
    </div>
  );
}
