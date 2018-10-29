import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Wrapper from 'components/Wrapper'
import FourOhFour from 'components/FourOhFour'
import Login from 'containers/Login'
import Profile from 'containers/Profile'
import InternalUser from 'containers/InternalUser'
import Client from 'containers/Client'
import Transaction from 'containers/Transaction'


class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Wrapper(InternalUser)} />
          <Route exact path="/profile" component={Wrapper(Profile)} />
          <Route exact path="/admins" component={Wrapper(InternalUser)} />
          <Route exact path="/super-resellers" component={Wrapper(InternalUser)} />
          <Route exact path="/resellers" component={Wrapper(InternalUser)} />
          <Route exact path="/clients" component={Wrapper(Client)} />
          <Route exact path="/transactions" component={Wrapper(Transaction)} />
          <Route exact path="/login" component={Login} />
          <Route component={FourOhFour} />
        </Switch>
      </Router>
    )
  }
}

export default App
