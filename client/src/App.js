import React, { Component } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Button from '@material-ui/core/Button';
import { AccessAlarm } from '@material-ui/icons';


class App extends Component {
  render() {
    return (
      <div>
        <CssBaseline/>
        <h1>HELLO</h1>
        <AccessAlarm/>
        <Button variant="contained" color="primary">
          Hello World
        </Button>
      </div>
    );
  }
}

export default App
