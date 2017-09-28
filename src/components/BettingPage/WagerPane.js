import React from 'react';
import ReactDOM from 'react-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class WagerPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 50,
    }
  }
  onSliderChange = (value) => {
    this.setState({
      value,
    })
  }
  render() {
    return (
      <div className="wager_box">
        <div className="wager_value">
          ${this.state.value}
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
