import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Wrapper from './components/common/Wrapper';
import FourOhFour from './components/common/FourOhFour';
import Login from './containers/Login';
import Home from './containers/Home';


class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Wrapper(Home)} />
          <Route exact path="/login" component={Login} />
          <Route component={FourOhFour} />
        </Switch>
      </Router>
    );
  }
}

export default App
