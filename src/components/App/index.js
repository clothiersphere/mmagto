import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

function App({ children }) {
  return <MuiThemeProvider>{children}</MuiThemeProvider>
}

export default App;

