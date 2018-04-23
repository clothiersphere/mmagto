import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react';

export default class FightCard extends Component {

  state = { active: false };
  handleShow = () => this.setState({ active: true });
  handleHide = () => this.setState({ active: false });

  handleClick(fight) {
    const { selectFight } = this.props;
    
    const homeId = fight.homeInfo.id;
    const visitorId = fight.visitorInfo.id;
    selectFight(fight);
    this.props.history.push(`${this.props.location.pathname}/${homeId}v${visitorId}`)
  }

  render() { 

    const convertName = (string) => {
      const lastName = string.split(' ');
      if (lastName.length >= 2) {
        return <div> {lastName[lastName.length - 1]} </div>;
      }
      return <div> {lastName} </div>;
    };
    console.log(this.props, "this in fightcard")

    const { active } = this.state;
    const { selectedEvent, selectedFight } = this.props;

    if (!selectedEvent[0]) {
      return null;
    }

    // return (
    //   <div>
    //     <Dimmer.Dimmable dimmed={active}>
    //     <Dimmer active={active} onClickOutside={this.handleHide}>
    //       <Loader indeterminate> Querying Fighter Stats </Loader>
    //     </Dimmer>
    //     <div className="fightCard">
    //       {selectedEvent[0].fights.map((fight, key) => {
    //         if (!fight.homeInfo || !fight.visitorInfo) {
    //           return null;
    //         }
    //         return (
    //           <div className="fightCardFaceOff" role="link" key={key} onClick={() => this.handleClick(fight)}>
    //             <div className="small_faceOff_home">
    //               <img className="faceOff_home small_portrait" alt="home" src={fight.homeInfo.profile_image} />
    //               <div className="home home_faceOff_LastName">
    //                 {convertName(fight.homeInfo.last_name)}
    //               </div>
    //             </div>
    //             <div className="small_faceOff_visitor">
    //               <img className="faceOff_visitor small_portrait" alt="visitor" src={fight.visitorInfo.profile_image} />
    //               <div className="visitor visitor_faceOff_LastName">
    //                 {convertName(fight.visitorInfo.last_name)}
    //               </div>
    //             </div>
    //           </div>
    //         );
    //       })}
    //     </div>
    //     </Dimmer.Dimmable>
    //   </div>
    // );
    return (
      <div className="fightCard">
        {selectedEvent[0].fights.map((fight, key) => {
          if (!fight.homeInfo || !fight.visitorInfo) {
            return null;
          }
          return (
            <div className="fightCardFaceOff" role="link" key={key} onClick={() => this.handleClick(fight)}>
              <div className="small_faceOff_home">
                <img className="faceOff_home small_portrait" alt="home" src={fight.homeInfo.profile_image} />
                <div className="home home_faceOff_LastName">
                  {convertName(fight.homeInfo.last_name)}
                </div>
              </div>
              <div className="small_faceOff_visitor">
                <img className="faceOff_visitor small_portrait" alt="visitor" src={fight.visitorInfo.profile_image} />
                <div className="visitor visitor_faceOff_LastName">
                  {convertName(fight.visitorInfo.last_name)}
                </div>
              </div>
            </div>
          );
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
