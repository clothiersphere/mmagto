import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

class App extends Component {
  componentDidMount() {
    this.props.getEvents();
  }

  render() {
    const { props } = this;
    return (
      <div className="presenter">
        <Header {...props} />
        <Body {...props} />
        <Footer />
      </div>
    );
  }
}

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
    getEvents: () => dispatch(actions.getEvents()),
    selectEvent: event => dispatch(actions.selectEvent(event)),
    selectFight: fight => dispatch(actions.selectFight(fight)),
    selectFighter: fighter => dispatch(actions.selectFighter(fighter)),
    fightReset: () => dispatch(actions.fightReset()),
    eventsReset: () => dispatch(actions.eventsReset()),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
