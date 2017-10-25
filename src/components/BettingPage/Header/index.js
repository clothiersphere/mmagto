import React, { Component } from 'react';
import { Menu, Breadcrumb } from 'semantic-ui-react';
// import { Breadcrumb } from 'semantic-ui-react';
import * as actions from '../../../actions';

export default class Header extends Component {
  state = {};

  handleItemClick = (e, { name }) => {
    if (name === 'eventList') {
     const { eventsReset } = this.props;
     eventsReset();
    }
    this.setState({activeItem: name})
  }

  


  render() {
    const { activeItem } = this.state;

    return (
      <Menu>
        <Menu.Item
          name="eventList"
          active={activeItem === "eventList"}
          onClick={this.handleItemClick}
        >
          Event List 
        </Menu.Item>
        
        <Menu.Item
          name="fightCard"
          active={activeItem === "fightCard"}
          onClick={this.handleItemClick}
        >
          Fight Card
        </Menu.Item>
        <Menu.Item
          name="odds"
          active={activeItem === "odds"}
          onClick={this.handleItemClick}
        >
          Odds
        </Menu.Item>
      </Menu>
    );
  }
}

// export default class Header extends Component {
//   render() {
//     return (
//       <Breadcrumb>
//         <Breadcrumb.Section link>Event List</Breadcrumb.Section>
//         <Breadcrumb.Divider icon='right angle' />
//         <Breadcrumb.Section link>Fight Gallery</Breadcrumb.Section>
//         <Breadcrumb.Divider icon='right angle' />
//         <Breadcrumb.Section link>Odds</Breadcrumb.Section>
//       </Breadcrumb>
//     );
//   }
// }