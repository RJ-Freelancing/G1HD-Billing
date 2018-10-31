import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import InternalUserWrapper from 'containers/InternalUserWrapper'
import FourOhFour from 'components/FourOhFour'
import Login from 'containers/Login'
import ProfileWrapper from 'containers/ProfileWrapper'
import Profile from 'containers/Profile'
import Dashboard from 'containers/Dashboard';
import InternalUser from 'containers/InternalUser'
import Client from 'containers/Client'
import Transaction from 'containers/Transaction'
import TransactionWrapper from 'containers/TransactionWrapper'


class App extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/" component={InternalUserWrapper(Dashboard)} />
        <Route exact path="/admins" component={InternalUserWrapper(InternalUser)} />
        <Route exact path="/superResellers" component={InternalUserWrapper(InternalUser)} />
        <Route exact path="/resellers" component={InternalUserWrapper(InternalUser)} />
        <Route exact path="/clients" component={InternalUserWrapper(Client)} />
        <Route exact path="/transactions" component={TransactionWrapper(Transaction)} />
        <Route exact path="/profile" component={ProfileWrapper(Profile)} />
        <Route exact path="/login" component={Login} />
        <Route component={FourOhFour} />
      </Switch>
    )
  }
}

export default App
