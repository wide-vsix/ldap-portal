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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    flexGrow: 1,
    maxWidth: 450,
    // minHeight: 500,
    padding: 40,
    boxSizing: 'border-box',
  },
  userID: {
    width: '100%',
  },
  password: {
    width: '100%',
  },
  button: {
    float: 'right',
  },
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      err: [],
      userID: '',
      password: '',
    };
  }
  render() {
    return (
      <div className={this.props.classes.root}>
        <Grid container justify="center">
          <Paper className={this.props.classes.paper}>
            <form onSubmit={this.login.bind(this)}>
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <Typography gutterBottom variant="h5" align="center">
                    LogIn
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
                  <Button type="submit" variant="contained" color="primary" className={this.props.classes.button}>
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
  async login(e) {
    e.preventDefault();
    try {
      const {data} = await axios.post('/api/auth', {userID: this.state.userID, password: this.state.password});
      if (data.ok) {
        window.localStorage.setItem('token', data.token);
        this.props.history.push('/');
      }
    } catch (err) {
      const message = err.response ? err.response.data.message : err.message;
      const newErr = this.state.err.concat();
      newErr.push({timestamp: (new Date).valueOf(), message});
    }
  }
}

export default container(styles)(Login);
