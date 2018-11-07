import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader, Button } from 'semantic-ui-react';
import Bout from './Bout';

export default class FightCard extends Component {
  state = {
    active: false,
  };
  handleShow = () => this.setState({ active: true });
  handleHide = () => this.setState({ active: false });


  fighterSelect(fighter) {
    console.log(fighter, 'fighter');
  }

  handleButtonClick() {
    this.setState({ active: !this.state.active });
  }

  render() {
    // const convertName = (string) => {
    //   const lastName = string.split(' ');
    //   if (lastName.length >= 2) {
    //     return <div> {lastName[lastName.length - 1]} </div>;
    //   }
    //   return <div> {lastName} </div>;
    // };
    console.log(this.props, 'this in fightcard');

    const { active } = this.state;
    const { selectedEvent, selectedFight } = this.props;

    // const betting = fight => (
    // 5 rounds if one of the fighters is champ or it's the main card

    // );

    if (!selectedEvent[0]) {
      return null;
    }


    return (
      <div className="fightCard">
        {selectedEvent[0].fights.map((fight, key) => {
          if (!fight.home || !fight.visitor) {
            return null;
          }

          return <Bout fight={fight} key={key} />;
          })}
      </div>
    );
  }
}


// FightCard.propTypes = {
//   selectedEvent: PropTypes.arrayOf(PropTypes.object).isRequired,
//   selectFight: PropTypes.func.isRequired,
//   selectedFight: PropTypes.arrayOf(PropTypes.object).isRequired,
// };
