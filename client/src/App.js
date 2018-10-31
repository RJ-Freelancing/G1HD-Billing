import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Login from 'containers/Login'
import Wrapper from 'containers/Wrapper'


class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route component={Wrapper} />
      </Switch>
    )
  }
}

export default App
