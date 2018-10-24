import React from 'react';
import container from '../container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';

const styles = {
  root: {
    height: '100%',
  },
  paper: {
    flexGrow: 1,
    maxWidth: 400,
    padding: 20,
  },
  userID: {
    width: '100%',
  },
  password: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      password: '',
    };
  }
  render() {
    return (
      <div className={this.props.classes.root}>
        <Grid container justify="center">
          <Paper className={this.props.classes.paper}>
            <form action="javascript:void(0)" onSubmit={this.login.bind(this)}>
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <Typography gutterBottom variant="subtitle1">
                    Standard license
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="UserID"
                    className={this.props.classes.userID}
                    type="text"
                    autoComplete="username"
                    onChange={(e)=>{
                      this.setState({userID: e.target.value});
                    }}
                    value={this.state.userID}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    className={this.props.classes.password}
                    type="password"
                    autoComplete="current-password"
                    onChange={(e)=>{
                      this.setState({password: e.target.value});
                    }}
                    value={this.state.password}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" className={this.props.classes.button} onSubmit={this.login.bind(this)}>
                    Login
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </div>
    );
  }
  async login() {
    const {data} = await axios.post('/api/auth', {userID: this.state.userID, password: this.state.password});
    if (data.ok) {
      window.localStorage.setItem('token', data.token);
      this.props.history.push('/');
    }
  }
}

export default container(styles)(Login);
