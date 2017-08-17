import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import BettingPage from './presenter';

function mapStateToProps(state) {
  console.log(state, "state")
  const { fights } = state;

  return {
    fights
  };  
}

function mapDispatchToProps(dispatch) {
  return {
    // actions: bindActionCreators(actions.selectEvent, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BettingPage);
