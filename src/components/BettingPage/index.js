import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import BettingPage from './presenter';

function mapStateToProps(state) {
  const { fights } = state;
  const { selectedEvent } = state;
  const { selectedFight } = state;
  const { selectedFighter } = state;
  const { eventReset } = state;

  return {
    fights,
    selectedEvent,
    selectedFight,
    selectedFighter,
    eventReset
  };  
}

function mapDispatchToProps(dispatch) {
  return {
    setEvent: (event) => dispatch(actions.selectEvent(event)),
    selectFight: (fight) => dispatch(actions.selectFight(fight)),
    selectFighter: (fighter) => dispatch(actions.selectFighter(fighter)),
    eventsReset: () => dispatch(actions.eventsReset())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BettingPage);
