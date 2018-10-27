import React from 'react';
import container from '../container';
import assert from 'assert';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  root: {
  },
  index: {
    width: 100,
  },
  pubkey: {
    minWidth: 100,
    maxWidth: 700,
    overflowWrap: 'break-word',
  },
  pubkeyInput: {
    width: '100%',
  },
  delete: {
    width: 100,
  },
  add: {
    width: 100,
  },
};

class Pubkey extends React.Component {
  constructor(props) {
    super(props);
    const token = window.localStorage.getItem('token');
    this.state = {
      err: null,
      token,
      pubkey: [],
      inputPubkey: '',
      loadProgress: true,
      addProgress: false,
      delProgress: false,
    };
    (async ()=>{
      try {
        const {data} = await axios.get('/api/pubkey', {
          params: {token},
        });
        assert.notEqual(null, data.pubkey);
        this.setState({pubkey: data.pubkey, loadProgress: false});
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
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>pubkey</TableCell>
                    <TableCell>delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.pubkey.map((key, i)=>{
                    return (
                      <TableRow key={i}>
                        <TableCell className={this.props.classes.pubkey}>{key}</TableCell>
                        <TableCell className={this.props.classes.delete}>
                          {this.state.delProgress == key
                            ?
                            <CircularProgress/>
                            :
                            <Button variant="contained" color="primary" onClick={()=>this.delPubkey(key)} disabled={this.state.pubkey.length==1}>delete</Button>
                          }
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell className={this.props.classes.pubkey}>
                      <TextField className={this.props.classes.pubkeyInput} multiline value={this.state.inputPubkey} onChange={(e)=>this.setState({inputPubkey: e.target.value})}/>
                    </TableCell>
                    <TableCell className={this.props.classes.add}>
                      {this.state.addProgress
                        ?
                        <CircularProgress/>
                        :
                        <Button variant="contained" color="primary" onClick={this.addPubkey.bind(this)}>add</Button>
                      }
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        }
      </div>
    );
  }
  async addPubkey() {
    const {token, inputPubkey} = this.state;
    try {
      this.setState({addProgress: true});
      const {data} = await axios.post('/api/pubkey', {token, pubkey: inputPubkey});
      if (data.ok) {
        this.setState({pubkey: [...this.state.pubkey, inputPubkey], inputPubkey: ''});
      }
      this.setState({addProgress: false});
    } catch (err) {
      this.setState({err: err.response ? err.response.data.message : err.message, addProgress: false});
    }
  }
  async delPubkey(pubkey) {
    const {token} = this.state;
    try {
      this.setState({delProgress: pubkey});
      const {data} = await axios.delete('/api/pubkey', {data: {token, pubkey}});
      if (data.ok) {
        this.setState({pubkey: this.state.pubkey.filter((key)=>key!=pubkey)});
      }
      this.setState({delProgress: false});
    } catch (err) {
      this.setState({err: err.response ? err.response.data.message : err.message, delProgress: false});
    }
  }
}

export default container(styles)(Pubkey);
