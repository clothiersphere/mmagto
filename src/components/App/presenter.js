import React, { Component } from 'react';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';


export default class App extends Component {
  render() {
    const { props } = this;

    return (
      <div className="presenter">
        <Header />
        <Body {...{ props }} />
        <Footer />
      </div>
    );
  }
}
