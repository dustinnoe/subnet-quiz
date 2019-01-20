import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './Home';
import SubnetMask from './SubnetMask';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/subnet-masks' component={SubnetMask} />
          <Route exact path='/www.dustinnoe.com/index.html' component={Home} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
