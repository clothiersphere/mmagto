import React, { Component } from 'react';
import * as actions from '../../../actions';
// import Sidebar from './Sidebar';
import CircularProgress from 'material-ui/CircularProgress';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import { indigo500, blue500, lightBlue500, cyan500, indigoA100, blueA100, lightBlueA100, cyan50A100, teal500, green500, lightGreen500, lime500 } from 'material-ui/styles/colors';

import { Menu } from 'semantic-ui-react';

export default function Header({events = {}}) {

  const colorPalette = [blue500, lightBlue500, cyan500, indigoA100, blueA100, lightBlueA100, cyan50A100, teal500, green500, lightGreen500, lime500];

  class HeaderMenu extends Component { 
    state = {}

    handleItemClick = (e, { name }) => this.setState({activeItem: name})

    render() {
      const { activeItem } = this.state

      return (
        <Menu>
          <Menu.Item
            name='eventList'
            active={activeItem === 'eventList'}
            onClick={this.handleItemClick}
          >
            Event List 
          </Menu.Item>
          
          <Menu.Item
            name='fightCard'
            active={activeItem === 'fightCard'}
            onClick={this.handleItemClick}
          >
            Fight Card
          </Menu.Item>

          <Menu.Item
            name='odds'
            active={activeItem === 'odds'}
            onClick={this.handleItemClick}
          >
            Odds
          </Menu.Item>
        </Menu>
      )
    }
  }
  
  return <HeaderMenu />
}
