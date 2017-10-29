import React, { Component } from 'react';
import { Menu, Segment, Icon } from 'semantic-ui-react';
import * as actions from '../../../actions';

export default class Header extends Component {
  state = { 
    activeItem: 'home', 
    fightCardMenu: 'disabled', 
    wagerMenu: 'disabled'
  };


  componentWillReceiveProps(nextProps) {
    const {selectedEvent, selectedFight } = nextProps.other;
    
    if (selectedEvent[0] && !selectedFight[0]) {
      if (this.state.activeItem != 'fightCard') {
        this.setState({
          activeItem: 'fightCard', 
          fightCardMenu: 'enabled', 
          wagerMenu: 'disabled'
        });
      }
    }

    if (selectedFight[0] && this.state.activeItem === 'fightCard') {
      this.setState({activeItem: 'wagerMenu'});
    }
  }

  handleItemClick = (e, { name }) => {
    if (name === 'eventList') {
     const { eventsReset } = this.props;
     eventsReset();
     this.setState({
       activeItem: name,
       fightCardMenu: 'disabled',
       wagerMenu: 'disabled'
     });
    }

    if (name === 'fightCard') {
      const { fightReset } = this.props.other;
      fightReset();
      this.setState({
        activeItem: name, 
        fightCardMenu: 'enabled',
        wagerMenu: 'disabled'
      });
    } 
  }

  showMenu(status) {
    if (status === 'enabled'){
      return false;
    }

    return true;
  }

  render() {
    const { activeItem } = this.state;
    const {selectedEvent, selectedFight } = this.props.other;
    const { fightCardMenu, wagerMenu } = this.state;

    return (
      <div className="header">
        <Menu pointing secondary>
          <Menu.Item
            name="eventList"
            active={activeItem === "eventList"}
            onClick={this.handleItemClick}
          >
            <Icon name="list" />
            <span className="text">Event List</span>
          </Menu.Item>
          <Menu.Item disabled={this.showMenu(fightCardMenu)}
            name="fightCard"
            active={activeItem === "fightCard"}
            onClick={this.handleItemClick}
          >
            Fight Card
          </Menu.Item>
          <Menu.Item disabled={this.showMenu(wagerMenu)}
            name="wagerMenu"
            active={activeItem === "wagerMenu"}
          >
            Wager
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}
