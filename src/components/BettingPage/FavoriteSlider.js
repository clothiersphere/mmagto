import React, { Component } from 'react'
import Slider from 'react-rangeslider'

class FavoriteSlider extends Component {
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
        step="1"
        min="1"
        max="10"
        onChange={this.handleOnChange}
      />
    )
  }
}

export default FavoriteSlider;