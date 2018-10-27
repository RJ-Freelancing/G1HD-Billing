import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Wrapper from './components/common/Wrapper';
import FourOhFour from './components/common/FourOhFour';
import Login from './containers/Login';
import Profile from './containers/Profile';
import Dashboard from './containers/Dashboard';
import User from './containers/User';
import Client from './containers/Client';
import Transaction from './containers/Transaction';


class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Wrapper(Dashboard)} />
          <Route exact path="/profile" component={Wrapper(Profile)} />
          <Route exact path="/users" component={Wrapper(User)} />
          <Route exact path="/clients" component={Wrapper(Client)} />
          <Route exact path="/transactions" component={Wrapper(Transaction)} />
          <Route exact path="/login" component={Login} />
          <Route component={FourOhFour} />
        </Switch>
      </Router>
    );
  }
}

export default App
