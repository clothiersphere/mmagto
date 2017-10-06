import React from 'react';
import ReactDOM from 'react-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class WagerPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 0}
  }

  onSliderChange = (value) => {
    console.log(value, "value")
    this.props.onWagerChange(value)
  }

  render() {
    console.log(this.props, "thisprops")
    var wager = this.props.wagerValue;
    console.log(wager, "wager")

    return (
      <div className="wager_box">
        <div className="wager_value">
          ${wager}
        </div>
        <Slider 
          value={this.state.value} 
          onChange={this.onSliderChange}
        />
      </div>
    )
  }
}

export default WagerPane;
