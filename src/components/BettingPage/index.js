import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import BettingPage from './presenter';

function mapStateToProps(state) {
  console.log(state, "state")
  const { fights } = state;
  const { selectedEvent } = state;
  const { selectedFight } = state;

  return {
    fights,
    selectedEvent,
    selectedFight
  };  
}

function mapDispatchToProps(dispatch) {
  return {
    setEvent: (event) => dispatch(actions.selectEvent(event)),
    selectFight: (fight) => dispatch(actions.selectFight(fight))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BettingPage);
