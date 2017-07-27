import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import BettingPage from './presenter';

function mapStateToProps(state) {
  const { odds } = state;
  
  return {
    odds
  };  
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BettingPage);