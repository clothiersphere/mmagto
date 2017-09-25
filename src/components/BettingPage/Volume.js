import React, { Component } from 'react'
import Slider from 'react-rangeslider'

class VolumeSlider extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      volume: 50
    }
  }

  handleOnChange = (value) => {
    this.setState({
      volume: value
    })
  }

  render() {
    let { volume } = this.state
    return (
      <Slider
        value={volume}
        orientation="horizontal"
        step="100"
        onChange={this.handleOnChange}
      />
    )
  }
}

export default VolumeSlider;