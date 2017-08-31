import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import BettingPage from './presenter';

function mapStateToProps(state) {
  console.log(state, "state")
  const { fights } = state;
  const { selectedEvent } = state;

  return {
    fights,
    selectedEvent
  };  
}

function mapDispatchToProps(dispatch) {
  return {
    // setEvent: (fight) => bindActionCreators(actions.selectEvent(fight), dispatch)
    setEvent: (fight) => dispatch(actions.selectEvent(fight))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BettingPage);
