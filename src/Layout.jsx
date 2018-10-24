import React from 'react';
import container from './container';
import {Router, Switch, Route, Redirect} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import Index from './pages/Index.jsx';
import Login from './pages/Login.jsx';
import Pubkey from './pages/Pubkey.jsx';

const styles = {
  root: {
    height: '100%',
  },
};

function Auth(props) {
  const token = window.localStorage.getItem('token');
  if (token) {
    return props.children;
  } else {
    return <Redirect to="/login"/>;
  }
}

class Layout extends React.Component {
  constructor(...props) {
    super(...props);
    this.history = createBrowserHistory();
  }
  render() {
    return (
      <div className={this.props.classes.root}>
        <Router history={this.history}>
          <Switch>
            <Route path='/login' component={Login} exact />
            <Auth>
              <Route path='/' component={Index} exact />
              <Route path='/pubkey' component={Pubkey} exact />
            </Auth>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default container(styles)(Layout);
