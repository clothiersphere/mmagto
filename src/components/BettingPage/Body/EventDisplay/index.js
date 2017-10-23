import React from 'react';
import EventList from './EventList';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react';

export default function EventDisplay({fights, selectFight}) {

  if (fights.length === 0) {
    return (
      <Segment>
        <Dimmer active>
          <Loader />
        </Dimmer>
      </Segment>
    )
  } else {
    return <EventList {...{fights, selectFight}} />
  }
}