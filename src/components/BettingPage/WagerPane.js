import React from 'react';
import ReactDOM from 'react-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class WagerPane extends React.Component {
  constructor(props) {
    super(props);
  }

  onSliderChange = (value) => {
    this.props.onWagerChange(value)
  }

  render() {
    var wager = this.props.wagerValue;

    return (
      <div className="wager_box">
        <div className="wager_value">
          ${wager}
        </div>
        <Slider 
          value={wager} 
          onChange={this.onSliderChange}
          defaultValue={20}
        />
      </div>
    )
  }
}

export default WagerPane;
