import React from 'react';
import container from '../container';
import assert from 'assert';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CircularProgress from '@material-ui/core/CircularProgress';

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
  shell: {
    width: '100%',
  },
  button: {
    float: 'right',
  },
};

const shells = [
  '/bin/sh',
  '/bin/bash',
  '/bin/rbash',
  '/bin/dash',
  '/bin/tcsh',
  '/bin/csh',
  '/bin/zsh',
  '/usr/bin/zsh',
  '/usr/bin/fish',
];

class Pubkey extends React.Component {
  constructor(props) {
    super(props);
    const token = window.localStorage.getItem('token');
    this.state = {
      err: null,
      token,
      shell: '',
      loadProgress: true,
    };
    (async ()=>{
      try {
        const {data} = await axios.get('/api/shell', {
          params: {token},
        });
        assert.notEqual(null, data.shell);
        this.setState({shell: data.shell, loadProgress: false});
        console.log(data.shell);
      } catch (err) {
        this.setState({err: err.response ? err.response.data.message : err.message, loadProgress: false});
      }
    })();
  }
  render() {
    return (
      <div className={this.props.classes.root}>
        <Snackbar open={this.state.err!=null} autoHideDuration={2000} anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }} onClose={()=>{
          this.setState({err: null});
        }}>
          <SnackbarContent message={this.state.err}/>
        </Snackbar>
        {this.state.loadProgress
          ?
          <Grid container justify="center">
            <CircularProgress/>
          </Grid>
          :
          <Grid container justify="center">
            <Paper className={this.props.classes.paper}>
              <form onSubmit={this.setShell.bind(this)}>
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    <Typography gutterBottom variant="h5" align="center">
                    Change Shell
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl className={this.props.classes.shell}>
                      <InputLabel htmlFor="shell-select">Shell</InputLabel>
                      <Select
                        value={this.state.shell}
                        onChange={(e)=>{
                          this.setState({shell: e.target.value});
                        }}
                        inputProps={{
                          name: 'shell',
                          id: 'shell-select',
                        }}
                      >
                        {shells.map((shell)=>{
                          return <MenuItem key={shell} value={shell}>{shell}</MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    {this.state.progress
                      ?
                      <Grid container justify="center">
                        <CircularProgress/>
                      </Grid>
                      :
                      <Button type="submit" variant="contained" color="primary" className={this.props.classes.button}>
                      Submit
                      </Button>
                    }
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        }
      </div>
    );
  }
  async setShell(e) {
    e.preventDefault();
    const {token, shell} = this.state;
    try {
      this.setState({loadProgress: true});
      const {data} = await axios.post('/api/shell', {token, shell});
      if (data.ok) {
        this.setState({shell});
      }
      this.setState({loadProgress: false});
    } catch (err) {
      this.setState({err: err.response ? err.response.data.message : err.message, addProgress: false});
    }
  }
}

export default container(styles)(Pubkey);
