import React from 'react';
import ReactDOM from 'react-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class BettingSlider extends React.Component {
  constructor(props) {
    super(props);
  }

  onSliderChange = (value) => {
    this.props.onWagerChange(value)
  }

  defaultValue() {
    return this.props.defaultValue;
  }

  render() {
    var wager = this.props.wagerValue;
    var defaultValue = this.props.defaultValue;
    console.log(defaultValue, "DV")

    return (
      <div className="wager_box">
        <div className="wager_value">
          ${wager}
        </div>
        <Slider 
          value={wager} 
          onChange={this.onSliderChange}
          defaultValue={this.defaultValue()}
        />
      </div>
    )
  }
}

export default BettingSlider;
