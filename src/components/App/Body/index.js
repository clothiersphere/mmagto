import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import EventList from './EventList';
import FightCard from './FightCard';
import Banner from './Banner';
import BettingPane from './BettingPane';

export default class Body extends Component {
  render() {
    const { props } = this;
    const { selectedEvent, selectedFight } = props;

    return (
      <div className="bodyContainer">
        <Banner {...selectedEvent} {...selectedFight} />
        <Switch>
          <Route path="/eventlist/:eventId/:fighters" render={routeProps => <BettingPane {...routeProps} {...props} />} />
          <Route path="/fightCard" render={routeProps => <FightCard {...routeProps} {...props} />} />
          <Route exact path="/" render={routeProps => <EventList {...routeProps} {...props} />} />
        </Switch>
      </div>
    );
  }
}
