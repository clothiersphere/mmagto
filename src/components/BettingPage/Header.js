import React, { Component } from 'react';
import { Menu, Segment, Icon } from 'semantic-ui-react';
import * as actions from '../../actions';

export default class Header extends Component {
  state = { activeItem: 'home', fightCard: 'disabled', odds: 'disabled'};


  componentWillReceiveProps(nextProps) {
    const {selectedEvent, selectedFight } = nextProps.other;

    if (selectedEvent[0] && !selectedFight[0]) {
      if (this.state.activeItem != 'fightCard') {
        this.setState({activeItem: 'fightCard'});
      }
    }

    if (selectedFight[0] && this.state.activeItem === 'fightCard') {
        this.setState({activeItem: 'odds'});
    }
  }

  handleItemClick = (e, { name }) => {
    if (name === 'eventList') {
     const { eventsReset } = this.props;
     eventsReset();
    }

    if (name === 'fightCard') {
      const { fightReset } = this.props.other;
      fightReset();
    }
    this.setState({activeItem: name})
  }

  render() {
    const { activeItem } = this.state;
    const {selectedEvent, selectedFight } = this.props.other;
    
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
      </div>
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