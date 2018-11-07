import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

export default class Bout extends Component {
  state = {
    active: false,
    winner: '',
    method: '',
    rounds: '',
  };

  // toggleKo(fight) {
  //   this.setState({
  //     toggleKo: !this.state.toggleKo,
  //     toggleSub: false,
  //     toggleDec: false,
  //   });
  // }

  // toggleDec(fight) {
  //   this.setState({
  //     toggleKo: false,
  //     toggleSub: false,
  //     toggleDec: !this.state.toggleDec,
  //   });
  // }

  // toggleSub(fight) {
  //   this.setState({
  //     toggleKo: false,
  //     toggleSub: !this.state.toggleSub,
  //     toggleDec: false,
  //   });
  // }

  fighterSelect(fighter) {
    this.setState({ winner: fighter });
  }

  methodSelect(method) {
    if (method === 'dec') {
      this.setState({
        method,
        rounds: 3,
      });
    } else {
      this.setState({ method });
    }
  }

  toggleKo() {
    if (this.state.method === 'tko/ko') {
      return true;
    }
    return false;
  }

  toggleSub() {
    if (this.state.method === 'sub') {
      return true;
    }
    return false;
  }

  toggleDec() {
    if (this.state.method === 'dec') {
      return true;
    }
    return false;
  }

  render() {
    const { fight } = this.props;
    const {
      active,
      winner,
      method,
      rounds,
    } = this.state;

    return (
      <div className="outline">
        <div className="fightCardFaceOff" role="link">
          <div className="small_faceOff_home stack" onClick={() => this.fighterSelect(fight.home.last_name)}>
            <img className="faceOff_home small_portrait" alt="home" src={fight.home.profile_image} />
            <div className="home home_faceOff_LastName">
              {fight.home.last_name}
            </div>
          </div>
          <div className="small_faceOff_visitor stack" onClick={() => this.fighterSelect(fight.visitor.last_name)}>
            <img className="faceOff_visitor small_portrait" alt="visitor" src={fight.visitor.profile_image} />
            <div className="visitor visitor_faceOff_LastName">
              {fight.visitor.last_name}
            </div>
          </div>
        </div>
        <div>
          <div>
            <Button.Group>
              <Button color="grey" toggle active={this.toggleKo()} onClick={() => this.methodSelect('tko/ko')} size="mini">tko/ko</Button>
              <Button.Or />
              <Button color="grey" toggle active={this.toggleSub()} onClick={() => this.methodSelect('sub')} size="mini">submission</Button>
              <Button.Or />
              <Button color="grey" toggle active={this.toggleDec()} onClick={() => this.methodSelect('dec')} size="mini">decision</Button>
            </Button.Group>
          </div>
          <Button.Group>
            <Button circular>1</Button>
            <Button circular>2</Button>
            <Button circular>3</Button>
          </Button.Group>
        </div>
      </div>
    );
  }
}
