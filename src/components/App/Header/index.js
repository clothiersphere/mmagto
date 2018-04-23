import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'semantic-ui-react';

export default class Header extends Component {
  state = {
    activeItem: 'home',
    fightCardMenu: 'disabled',
    wagerMenu: 'disabled',
  };

  handleItemClick = (e, { name }) => {
    if (name === 'eventList') {
      const { eventsReset } = this.props;
      eventsReset();
      this.setState({
        activeItem: name,
        fightCardMenu: 'disabled',
        wagerMenu: 'disabled',
      });
    }

    if (name === 'fightCard') {
      const { fightReset } = this.props.other;
      fightReset();
      this.setState({
        activeItem: name,
        fightCardMenu: 'enabled',
        wagerMenu: 'disabled',
      });
    }
  }

  showMenu = (status) => {
    if (status === 'enabled') {
      return false;
    }
    return true;
  }
  
  render() {
    const { activeItem } = this.state;
    const { fightCardMenu, wagerMenu } = this.state;

    return (
      <div className="header">
        <Menu pointing secondary>
          <Menu.Item
            name="eventList"
            active={activeItem === 'eventList'}
            onClick={this.handleItemClick}
          >
            <Icon name="list" />
            <span className="text">Event List</span>
          </Menu.Item>
          <Menu.Item
            disabled={this.showMenu(fightCardMenu)}
            name="fightCard"
            active={activeItem === 'fightCard'}
            onClick={this.handleItemClick}
          >
            Fight Card
          </Menu.Item>
          <Menu.Item
            disabled={this.showMenu(wagerMenu)}
            name="wagerMenu"
            active={activeItem === 'wagerMenu'}
          >
            Wager
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

// Header.propTypes = {
//   other: PropTypes.shape({
//     selectedEvent: PropTypes.arrayOf(PropTypes.object),
//     selectFight: PropTypes.func.isRequired,
//     fightReset: PropTypes.func.isRequired,
//   }),
//   eventsReset: PropTypes.func.isRequired,
// };

// Header.defaultProps = {
//   other: {},
// };
