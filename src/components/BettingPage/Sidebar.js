import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import ActionList from 'material-ui/svg-icons/action/list';
import {fullWhite} from 'material-ui/styles/colors';
import { indigo500, blue500, lightBlue500, cyan500, indigoA100, blueA100, lightBlueA100, cyan50A100, teal500, green500, lightGreen500, lime500 } from 'material-ui/styles/colors';

const colorPalette = [blue500, lightBlue500, cyan500, indigoA100, blueA100, lightBlueA100, cyan50A100, teal500, green500, lightGreen500, lime500];

export default class Sidebar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  showEvents(events) {
    return events.fights.map((fight, key) => {
      return (
        <MenuItem key={key}>
        <div className="events" 
          style={{backgroundColor:colorPalette[key]}}
          onClick={()=> events.setEvent(fight)}
        >
        {fight.eventInfo.base_title}:{fight.eventInfo.title_tag_line}
        </div>
        </MenuItem> 
      )
    })
  }

  handleToggle = () => this.setState({open: !this.state.open});
  handleClose = () => this.setState({open: false});

  render() {
    const { props } = this.props;
    
    return (
      <div>
        <RaisedButton
          // backgroundColor="#a4c639"
          icon={<ActionList />}
          onClick={this.handleToggle}
          style={{margin:12}}
        />
        <Drawer 
          open={this.state.open}
          docked={false}
          onRequestChange={(open) => this.setState({open})}
        >
          {this.showEvents(props)}
        </Drawer>
      </div>
    );
  }
}
