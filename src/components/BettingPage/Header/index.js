import React, { Component } from 'react';
import * as actions from '../../../actions';
import { Menu } from 'semantic-ui-react';



export default class Header extends Component { 
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