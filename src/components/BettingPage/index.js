import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import BettingPage from './presenter';

function mapStateToProps(state) {
  const {
    fights,
    selectedEvent,
    selectedFight,
    selectedFighter,
  } = state;

  return {
    fights,
    selectedEvent,
    selectedFight,
    selectedFighter,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectEvent: event => dispatch(actions.selectEvent(event)),
    selectFight: fight => dispatch(actions.selectFight(fight)),
    selectFighter: fighter => dispatch(actions.selectFighter(fighter)),
    fightReset: () => dispatch(actions.fightReset()),
    eventsReset: () => dispatch(actions.eventsReset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BettingPage);
